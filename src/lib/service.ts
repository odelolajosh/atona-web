let swRegistration: ServiceWorkerRegistration | null = null;

const registerServiceWorker = async () => {
  if (swRegistration) return swRegistration;

  if ('serviceWorker' in navigator) {
    swRegistration = await navigator.serviceWorker.register('/service-worker.js');
    return swRegistration;
  }
  
  return null;
}

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification');
  }
}

const showLocalNotification = (title: string, body: string, data?: object) => {
  if (!swRegistration) return;

  console.log('showLocalNotification', window.location.origin);
  const options = {
    body,
    icon: '/naero.png',
    data: {
      baseURL: window.location.origin,
      ...data
    }
    // here you can add more properties like icon, image, vibrate, etc.
  } as NotificationOptions;
  swRegistration.showNotification(title, options);
}

const setupServiceWorker = async () => {
  const swRegistration = await registerServiceWorker();
  if (!swRegistration) return;

  await requestNotificationPermission();

  // showLocalNotification('Hello', 'This is a notification');
}

export {
  setupServiceWorker,
  showLocalNotification
}
