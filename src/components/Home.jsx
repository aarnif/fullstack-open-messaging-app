import { useSubscription, useApolloClient } from "@apollo/client";
import { Outlet } from "react-router-dom";

import { GET_CONTACTS_BY_USER, GET_CHATS_BY_USER } from "../graphql/queries";
import {
  CONTACT_BLOCKED_OR_UNBLOCKED,
  GROUP_CHAT_PARTICIPANTS_UPDATED,
} from "../graphql/subscriptions";
import Menu from "./Menu";
import helpers from "../utils/helpers";

const Home = ({ user, activePath, setActivePath, setActiveMenuComponent }) => {
  const client = useApolloClient();

  useSubscription(CONTACT_BLOCKED_OR_UNBLOCKED, {
    onData: ({ data }) => {
      console.log("Use CONTACT_BLOCKED_OR_UNBLOCKED-subscription:");
      const blockingData = data.data.contactBlockedOrUnBlocked;
      client.cache.updateQuery(
        {
          query: GET_CONTACTS_BY_USER,
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

  useSubscription(GROUP_CHAT_PARTICIPANTS_UPDATED, {
    onData: ({ data }) => {
      console.log("Use GROUP_CHAT_PARTICIPANTS_UPDATED-subscription:");
      const { updatedChat, removedParticipants, addedParticipants } =
        data.data.groupChatParticipantsUpdated;
      client.cache.updateQuery(
        {
          query: GET_CHATS_BY_USER,
          variables: {
            searchByTitle: "",
          },
        },
        ({ allChatsByUser }) => {
          if (removedParticipants.includes(user.id)) {
            return {
              allChatsByUser: helpers.sortChatsByDate(
                allChatsByUser.filter((chat) => chat.id !== updatedChat.id)
              ),
            };
          } else if (addedParticipants.includes(user.id)) {
            return {
              allChatsByUser: helpers.sortChatsByDate(
                allChatsByUser.concat(updatedChat)
              ),
            };
          } else {
            return {
              allChatsByUser: helpers.sortChatsByDate(
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
          activePath={activePath}
          setActivePath={setActivePath}
          setActiveMenuComponent={setActiveMenuComponent}
        />
      )}
      <div className="flex-grow flex">
        <Outlet />
      </div>
    </main>
  );
};

export default Home;
