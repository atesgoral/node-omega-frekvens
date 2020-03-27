#ifndef _SAFEQUEUE_H_
#define _SAFEQUEUE_H_

#include <string>
#include <vector>

#include <uv.h>

using namespace std;

class SafeQueue {
  vector<string> m_queue;
  uv_mutex_t m_queueLock;

public:
  SafeQueue();

  void enqueue(const char *szValue);

  vector<string> &acquire();
  void release();
};

#endif // _SAFEQUEUE_H_
