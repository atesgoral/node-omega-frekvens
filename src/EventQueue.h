#ifndef _EVENTQUEUE_H_
#define _EVENTQUEUE_H_

#include <string>
#include <vector>

#include <uv.h>

using namespace std;

class EventQueue {
  vector<string> m_queue;
  uv_mutex_t m_queueLock;

public:
  EventQueue();

  void enqueue(const char *szValue);

  vector<string> &acquire();
  void release();
};

#endif // _EVENTQUEUE_H_
