#ifndef _EVENTQUEUE_H_
#define _EVENTQUEUE_H_

#include <string>
#include <vector>

#include <uv.h>

using namespace std;

class EventQueue {
  vector<string> m_queue1;
  vector<string> m_queue2;

  vector<string> *m_pQueue;
  vector<string> *m_pReceivingQueue;

  uv_mutex_t m_queueLock;

public:
  EventQueue();
  ~EventQueue();

  void push(const char *szValue);

  vector<string> &read();
};

#endif // _EVENTQUEUE_H_
