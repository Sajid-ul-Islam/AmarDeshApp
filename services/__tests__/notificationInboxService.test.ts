import {
  getInboxNotifications,
  addNotificationToInbox,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadNotificationCount,
} from '../notificationInboxService';

describe('NotificationInboxService', () => {
  beforeEach(async () => {
    await clearAllNotifications();
  });

  it('adds and retrieves notifications in inbox', async () => {
    const item = await addNotificationToInbox({
      title: 'টেস্ট নোটিফিকেশন',
      body: 'এটি একটি পরীক্ষামূলক বার্তা',
      channel: 'breaking',
      badge: 'ব্রেকিং',
    });

    expect(item.id).toBeDefined();
    expect(item.read).toBe(false);

    const list = await getInboxNotifications();
    expect(list.some((n) => n.id === item.id)).toBe(true);
  });

  it('marks a notification as read and computes unread count', async () => {
    const item = await addNotificationToInbox({
      title: 'নতুন সংবাদ',
      body: 'বিস্তারিত প্রতিবেদন প্রকাশিত হয়েছে',
      channel: 'daily',
    });

    let unread = await getUnreadNotificationCount();
    expect(unread).toBeGreaterThanOrEqual(1);

    await markNotificationAsRead(item.id);

    const updatedList = await getInboxNotifications();
    const found = updatedList.find((n) => n.id === item.id);
    expect(found?.read).toBe(true);
  });

  it('marks all notifications as read', async () => {
    await addNotificationToInbox({
      title: 'বার্তা ১',
      body: 'বিবরণ ১',
      channel: 'general',
    });
    await addNotificationToInbox({
      title: 'বার্তা ২',
      body: 'বিবরণ ২',
      channel: 'category',
    });

    await markAllNotificationsAsRead();
    const unread = await getUnreadNotificationCount();
    expect(unread).toBe(0);
  });

  it('deletes a single notification', async () => {
    const item = await addNotificationToInbox({
      title: 'মুছে ফেলার বার্তা',
      body: 'এটি মুছে যাবে',
      channel: 'general',
    });

    await deleteNotification(item.id);
    const list = await getInboxNotifications();
    expect(list.find((n) => n.id === item.id)).toBeUndefined();
  });
});
