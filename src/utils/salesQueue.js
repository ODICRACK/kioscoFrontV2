import { ventasService } from '../services/ventasService';

const QUEUE_KEY = 'kiosco_pending_sales';

const getQueue = () => {
  try {
    const data = localStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error al leer cola de ventas de localStorage:', err);
    return [];
  }
};

const saveQueue = (queue) => {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('Error al guardar cola de ventas en localStorage:', err);
  }
};

let isProcessing = false;

export const processSalesQueue = async () => {
  if (isProcessing) return;
  const queue = getQueue();
  if (queue.length === 0) return;

  isProcessing = true;

  try {
    const currentQueue = [...queue];
    const remainingQueue = [];

    for (const item of currentQueue) {
      try {
        await ventasService.crearVenta(item.payload);
      } catch (err) {
        console.warn('Error al sincronizar venta en segundo plano, se reintentará luego:', err);
        remainingQueue.push(item);
      }
    }

    saveQueue(remainingQueue);
  } finally {
    isProcessing = false;
  }
};

export const enqueueSale = (payload) => {
  const queue = getQueue();
  const newItem = {
    id_local: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    payload,
    timestamp: new Date().toISOString()
  };

  queue.push(newItem);
  saveQueue(queue);

  setTimeout(() => {
    processSalesQueue();
  }, 10);
};

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    processSalesQueue();
  });
}
