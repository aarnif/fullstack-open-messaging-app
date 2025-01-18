import { useSubscription, useApolloClient } from "@apollo/client";
import { Outlet } from "react-router";

import { ALL_CONTACTS_BY_USER, ALL_CHATS_BY_USER } from "../graphql/queries";
import {
  CONTACT_BLOCKED_OR_UNBLOCKED,
  GROUP_CHAT_EDITED,
} from "../graphql/subscriptions";
import Menu from "./Menu";
import chatAndMessageHelpers from "../helpers/chatAndMessageHelpers";

const Home = ({
  user,
  activeMenuItem,
  setActiveMenuItem,
  setActiveListMenuComponent,
  setActiveChatOrContactId,
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
                    (contact) => contact.id !== blockingData.target.id
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
    onError: (error) => {
      console.log("CONTACT_BLOCKED_OR_UNBLOCKED-subscription error:", error);
    },
  });

  useSubscription(GROUP_CHAT_EDITED, {
    onData: ({ data }) => {
      console.log("Use GROUP_CHAT_EDITED-subscription:");
      const { updatedChat, removedMemberIds, addedMemberIds } =
        data.data.groupChatEdited;
      client.cache.updateQuery(
        {
          query: ALL_CHATS_BY_USER,
          variables: {
            searchByTitle: "",
          },
        },
        ({ allChatsByUser }) => {
          if (removedMemberIds.includes(user.id)) {
            return {
              allChatsByUser: chatAndMessageHelpers.sortChatsByDate(
                allChatsByUser.filter((chat) => chat.id !== updatedChat.id)
              ),
            };
          } else if (addedMemberIds.includes(user.id)) {
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
    onError: (error) => {
      console.log("GROUP_CHAT_EDITED-subscription error:", error);
    },
  });

  return (
    <main className="flex-grow flex flex-col-reverse lg:flex-row">
      {user && (
        <Menu
          activeMenuItem={activeMenuItem}
          setActiveMenuItem={setActiveMenuItem}
          setActiveListMenuComponent={setActiveListMenuComponent}
          setActiveChatOrContactId={setActiveChatOrContactId}
        />
      )}
      <div className="flex-grow flex">
        <Outlet />
      </div>
    </main>
  );
};

export default Home;
