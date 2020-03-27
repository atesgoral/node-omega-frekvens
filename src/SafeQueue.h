#ifndef _SAFEQUEUE_H_
#define _SAFEQUEUE_H_

#include <vector>

#include <uv.h>

template <typename T> class SafeQueue {
  std::vector<T> m_queue;
  uv_mutex_t m_queueLock;

public:
  SafeQueue();

  void enqueue(T value);

  std::vector<T> &acquire();
  void release();
};

#endif // _SAFEQUEUE_H_
