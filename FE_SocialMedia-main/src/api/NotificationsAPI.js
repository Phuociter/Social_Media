import axios from 'axios';
/////////////HÀM MỚI///////////////
export const sendNotification = async (actorId, userId, type, referenceId) => {
  const notificationData = {
    actorId,
    userId,
    type,
    referenceId
  };

  return await axios.post('http://localhost:8080/api/notifications', notificationData);
};

