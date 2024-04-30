/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// Package buffer provides an implementation of an unbounded buffer.
package buffer

<<<<<<< HEAD
import "sync"
=======
<<<<<<< HEAD
import (
	"errors"
	"sync"
)
=======
import "sync"
>>>>>>> master
>>>>>>> master

// Unbounded is an implementation of an unbounded buffer which does not use
// extra goroutines. This is typically used for passing updates from one entity
// to another within gRPC.
//
// All methods on this type are thread-safe and don't block on anything except
// the underlying mutex used for synchronization.
//
// Unbounded supports values of any type to be stored in it by using a channel
// of `any`. This means that a call to Put() incurs an extra memory allocation,
// and also that users need a type assertion while reading. For performance
// critical code paths, using Unbounded is strongly discouraged and defining a
// new type specific implementation of this buffer is preferred. See
// internal/transport/transport.go for an example of this.
type Unbounded struct {
	c       chan any
	closed  bool
<<<<<<< HEAD
=======
<<<<<<< HEAD
	closing bool
=======
>>>>>>> master
>>>>>>> master
	mu      sync.Mutex
	backlog []any
}

// NewUnbounded returns a new instance of Unbounded.
func NewUnbounded() *Unbounded {
	return &Unbounded{c: make(chan any, 1)}
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
var errBufferClosed = errors.New("Put called on closed buffer.Unbounded")

// Put adds t to the unbounded buffer.
func (b *Unbounded) Put(t any) error {
	b.mu.Lock()
	defer b.mu.Unlock()
	if b.closing {
		return errBufferClosed
=======
>>>>>>> master
// Put adds t to the unbounded buffer.
func (b *Unbounded) Put(t any) {
	b.mu.Lock()
	defer b.mu.Unlock()
	if b.closed {
		return
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
	}
	if len(b.backlog) == 0 {
		select {
		case b.c <- t:
<<<<<<< HEAD
			return
=======
<<<<<<< HEAD
			return nil
=======
			return
>>>>>>> master
>>>>>>> master
		default:
		}
	}
	b.backlog = append(b.backlog, t)
<<<<<<< HEAD
=======
<<<<<<< HEAD
	return nil
}

// Load sends the earliest buffered data, if any, onto the read channel returned
// by Get(). Users are expected to call this every time they successfully read a
=======
>>>>>>> master
}

// Load sends the earliest buffered data, if any, onto the read channel
// returned by Get(). Users are expected to call this every time they read a
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
// value from the read channel.
func (b *Unbounded) Load() {
	b.mu.Lock()
	defer b.mu.Unlock()
<<<<<<< HEAD
	if b.closed {
		return
	}
=======
<<<<<<< HEAD
=======
	if b.closed {
		return
	}
>>>>>>> master
>>>>>>> master
	if len(b.backlog) > 0 {
		select {
		case b.c <- b.backlog[0]:
			b.backlog[0] = nil
			b.backlog = b.backlog[1:]
		default:
		}
<<<<<<< HEAD
=======
<<<<<<< HEAD
	} else if b.closing && !b.closed {
		close(b.c)
=======
>>>>>>> master
>>>>>>> master
	}
}

// Get returns a read channel on which values added to the buffer, via Put(),
// are sent on.
//
// Upon reading a value from this channel, users are expected to call Load() to
// send the next buffered value onto the channel if there is any.
//
// If the unbounded buffer is closed, the read channel returned by this method
<<<<<<< HEAD
// is closed.
=======
<<<<<<< HEAD
// is closed after all data is drained.
=======
// is closed.
>>>>>>> master
>>>>>>> master
func (b *Unbounded) Get() <-chan any {
	return b.c
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
// Close closes the unbounded buffer. No subsequent data may be Put(), and the
// channel returned from Get() will be closed after all the data is read and
// Load() is called for the final time.
func (b *Unbounded) Close() {
	b.mu.Lock()
	defer b.mu.Unlock()
	if b.closing {
		return
	}
	b.closing = true
	if len(b.backlog) == 0 {
		b.closed = true
		close(b.c)
	}
=======
>>>>>>> master
// Close closes the unbounded buffer.
func (b *Unbounded) Close() {
	b.mu.Lock()
	defer b.mu.Unlock()
	if b.closed {
		return
	}
	b.closed = true
	close(b.c)
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
}
