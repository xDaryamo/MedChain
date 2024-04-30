/*
 *
 * Copyright 2022 gRPC authors.
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

package grpcsync

import (
	"context"
<<<<<<< HEAD
	"sync"
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
	"sync"
=======
<<<<<<< HEAD
=======
	"sync"
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
	"sync"
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master

	"google.golang.org/grpc/internal/buffer"
)

// CallbackSerializer provides a mechanism to schedule callbacks in a
// synchronized manner. It provides a FIFO guarantee on the order of execution
// of scheduled callbacks. New callbacks can be scheduled by invoking the
// Schedule() method.
//
// This type is safe for concurrent access.
type CallbackSerializer struct {
	// done is closed once the serializer is shut down completely, i.e all
	// scheduled callbacks are executed and the serializer has deallocated all
	// its resources.
	done chan struct{}

	callbacks *buffer.Unbounded
<<<<<<< HEAD
	closedMu  sync.Mutex
	closed    bool
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
	closedMu  sync.Mutex
	closed    bool
=======
<<<<<<< HEAD
=======
	closedMu  sync.Mutex
	closed    bool
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
	closedMu  sync.Mutex
	closed    bool
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
}

// NewCallbackSerializer returns a new CallbackSerializer instance. The provided
// context will be passed to the scheduled callbacks. Users should cancel the
// provided context to shutdown the CallbackSerializer. It is guaranteed that no
// callbacks will be added once this context is canceled, and any pending un-run
// callbacks will be executed before the serializer is shut down.
func NewCallbackSerializer(ctx context.Context) *CallbackSerializer {
	cs := &CallbackSerializer{
		done:      make(chan struct{}),
		callbacks: buffer.NewUnbounded(),
	}
	go cs.run(ctx)
	return cs
}

// Schedule adds a callback to be scheduled after existing callbacks are run.
//
// Callbacks are expected to honor the context when performing any blocking
// operations, and should return early when the context is canceled.
//
// Return value indicates if the callback was successfully added to the list of
// callbacks to be executed by the serializer. It is not possible to add
// callbacks once the context passed to NewCallbackSerializer is cancelled.
func (cs *CallbackSerializer) Schedule(f func(ctx context.Context)) bool {
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
	return cs.callbacks.Put(f) == nil
}

func (cs *CallbackSerializer) run(ctx context.Context) {
	defer close(cs.done)

	// TODO: when Go 1.21 is the oldest supported version, this loop and Close
	// can be replaced with:
	//
	// context.AfterFunc(ctx, cs.callbacks.Close)
<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	cs.closedMu.Lock()
	defer cs.closedMu.Unlock()

	if cs.closed {
		return false
	}
	cs.callbacks.Put(f)
	return true
}

func (cs *CallbackSerializer) run(ctx context.Context) {
	var backlog []func(context.Context)

	defer close(cs.done)
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	for ctx.Err() == nil {
		select {
		case <-ctx.Done():
			// Do nothing here. Next iteration of the for loop will not happen,
			// since ctx.Err() would be non-nil.
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
		case cb := <-cs.callbacks.Get():
			cs.callbacks.Load()
			cb.(func(context.Context))(ctx)
		}
	}

	// Close the buffer to prevent new callbacks from being added.
	cs.callbacks.Close()

	// Run all pending callbacks.
	for cb := range cs.callbacks.Get() {
		cs.callbacks.Load()
		cb.(func(context.Context))(ctx)
<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
		case callback, ok := <-cs.callbacks.Get():
			if !ok {
				return
			}
			cs.callbacks.Load()
			callback.(func(ctx context.Context))(ctx)
		}
	}

	// Fetch pending callbacks if any, and execute them before returning from
	// this method and closing cs.done.
	cs.closedMu.Lock()
	cs.closed = true
	backlog = cs.fetchPendingCallbacks()
	cs.callbacks.Close()
	cs.closedMu.Unlock()
	for _, b := range backlog {
		b(ctx)
	}
}

func (cs *CallbackSerializer) fetchPendingCallbacks() []func(context.Context) {
	var backlog []func(context.Context)
	for {
		select {
		case b := <-cs.callbacks.Get():
			backlog = append(backlog, b.(func(context.Context)))
			cs.callbacks.Load()
		default:
			return backlog
		}
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	}
}

// Done returns a channel that is closed after the context passed to
// NewCallbackSerializer is canceled and all callbacks have been executed.
func (cs *CallbackSerializer) Done() <-chan struct{} {
	return cs.done
}
