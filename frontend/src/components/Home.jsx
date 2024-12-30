import { useSubscription, useApolloClient } from "@apollo/client";
import { Outlet } from "react-router-dom";

import { ALL_CONTACTS_BY_USER, ALL_CHATS_BY_USER } from "../graphql/queries";
import {
  CONTACT_BLOCKED_OR_UNBLOCKED,
  GROUP_CHAT_MEMBERS_UPDATED,
} from "../graphql/subscriptions";
import Menu from "./Menu";
import chatAndMessageHelpers from "../helpers/chatAndMessageHelpers";

const Home = ({
  user,
  activeMenuItem,
  setActiveMenuItem,
  setActiveListMenuComponent,
}) => {
  const client = useApolloClient();

  useSubscription(CONTACT_BLOCKED_OR_UNBLOCKED, {
    onData: ({ data }) => {
      console.log("Use CONTACT_BLOCKED_OR_UNBLOCKED-subscription:");
      const blockingData = data.data.contactBlockedOrUnBlocked;
      client.cache.updateQuery(
        {
          query: ALL_CONTACTS_BY_USER,
          variables: {
            searchByName: "",
          },
        },
        ({ allContactsByUser }) => {
          const updatedContacts = allContactsByUser.contacts.map((contact) => {
            if (contact.id === blockingData.actor) {
              const updatedBlockedContacts = blockingData.isBlocked
                ? [
                    ...new Set([
                      ...contact.blockedContacts,
                      blockingData.target,
                    ]),
                  ]
                : contact.blockedContacts.filter(
                    (id) => id !== blockingData.target
                  );

              return {
                ...contact,
                blockedContacts: updatedBlockedContacts,
              };
            }
            return contact;
          });

          return {
            allContactsByUser: {
              ...allContactsByUser,
              contacts: updatedContacts,
            },
          };
        }
      );
    },
  });

  useSubscription(GROUP_CHAT_MEMBERS_UPDATED, {
    onData: ({ data }) => {
      console.log("Use GROUP_CHAT_MEMBERS_UPDATED-subscription:");
      const { updatedChat, removedMembers, addedMembers } =
        data.data.groupChatMembersUpdated;
      client.cache.updateQuery(
        {
          query: ALL_CHATS_BY_USER,
          variables: {
            searchByTitle: "",
          },
        },
        ({ allChatsByUser }) => {
          if (removedMembers.includes(user.id)) {
            return {
              allChatsByUser: chatAndMessageHelpers.sortChatsByDate(
                allChatsByUser.filter((chat) => chat.id !== updatedChat.id)
              ),
            };
          } else if (addedMembers.includes(user.id)) {
            return {
              allChatsByUser: chatAndMessageHelpers.sortChatsByDate(
                allChatsByUser.concat(updatedChat)
              ),
            };
          } else {
            return {
              allChatsByUser: chatAndMessageHelpers.sortChatsByDate(
                allChatsByUser.map((chat) =>
                  chat.id === updatedChat.id ? { ...updatedChat } : chat
                )
              ),
            };
          }
        }
      );
    },
  });

  return (
    <main className="flex-grow flex">
      {user && (
        <Menu
          activeMenuItem={activeMenuItem}
          setActiveMenuItem={setActiveMenuItem}
          setActiveListMenuComponent={setActiveListMenuComponent}
        />
      )}
      <div className="flex-grow flex">
        <Outlet />
      </div>
    </main>
  );
};

export default Home;
