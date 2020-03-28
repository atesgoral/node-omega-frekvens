#include "EventQueue.h"

EventQueue::EventQueue() {
  m_pQueue = &m_queue1;
  m_pReceivingQueue = &m_queue2;

  uv_mutex_init(&m_queueLock);
}

EventQueue::~EventQueue() {
  uv_mutex_destroy(&m_queueLock);
}

void EventQueue::push(const char *szValue) {
  uv_mutex_lock(&m_queueLock);
  m_pReceivingQueue->push_back(szValue);
  uv_mutex_unlock(&m_queueLock);
}

vector<string> &EventQueue::read() {
  uv_mutex_lock(&m_queueLock);

  vector<string> *pSwap = m_pQueue;
  m_pQueue = m_pReceivingQueue;
  m_pReceivingQueue = pSwap;

  m_pReceivingQueue->clear();

  uv_mutex_unlock(&m_queueLock);

  return m_pQueue;
}
