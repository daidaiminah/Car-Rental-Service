import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiBell, FiCheck, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import {
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} from '../store/features/notifications/notificationsApiSlice';
import { useSocket } from '../context/SocketContext.jsx';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const socket = useSocket();

  const {
    data: notifications = [],
    isFetching,
    refetch,
  } = useGetNotificationsQuery();

  const [markNotificationsRead, { isLoading: markingRead }] =
    useMarkNotificationsReadMutation();

  const unreadCount = notifications.length;

  useEffect(() => {
    if (!socket) return undefined;

    const handleRefresh = () => refetch();

    socket.on('notification:new', handleRefresh);
    socket.on('notification:read', handleRefresh);

    return () => {
      socket.off('notification:new', handleRefresh);
      socket.off('notification:read', handleRefresh);
    };
  }, [socket, refetch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }

    return undefined;
  }, [open]);

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [notifications],
  );

  const handleToggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  const markAllAsRead = async () => {
    if (!notifications.length) return;
    try {
      await markNotificationsRead(notifications.map((item) => item.id)).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const markOneAsRead = async (id) => {
    try {
      await markNotificationsRead([id]).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggleDropdown}
        className="relative rounded-full bg-white p-2 shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Notifications"
      >
        <FiBell className="h-5 w-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black/5">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-gray-800">Notifications</p>
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-xs font-medium text-primary hover:text-primary-dark disabled:text-gray-400"
              disabled={markingRead || !notifications.length}
            >
              Mark all as read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {isFetching ? (
              <div className="p-4 text-sm text-gray-500">Loading...</div>
            ) : sortedNotifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-6 text-center text-sm text-gray-500">
                <FiClock className="h-6 w-6 text-gray-400" />
                <p>No new notifications</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {sortedNotifications.map((notification) => (
                  <li key={notification.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {notification.createdAt
                            ? formatDistanceToNow(
                                new Date(notification.createdAt),
                                { addSuffix: true },
                              )
                            : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => markOneAsRead(notification.id)}
                        className="rounded-full bg-gray-100 p-1 text-gray-500 hover:bg-gray-200"
                        aria-label="Mark notification as read"
                      >
                        <FiCheck className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
