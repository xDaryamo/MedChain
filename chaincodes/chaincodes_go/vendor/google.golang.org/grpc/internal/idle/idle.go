/*
 *
 * Copyright 2023 gRPC authors.
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

// Package idle contains a component for managing idleness (entering and exiting)
// based on RPC activity.
package idle

import (
	"fmt"
	"math"
	"sync"
	"sync/atomic"
	"time"
<<<<<<< HEAD
=======
<<<<<<< HEAD

	"google.golang.org/grpc/grpclog"
=======
<<<<<<< HEAD
=======

	"google.golang.org/grpc/grpclog"
>>>>>>> master
>>>>>>> master
>>>>>>> master
)

// For overriding in unit tests.
var timeAfterFunc = func(d time.Duration, f func()) *time.Timer {
	return time.AfterFunc(d, f)
}

// Enforcer is the functionality provided by grpc.ClientConn to enter
// and exit from idle mode.
type Enforcer interface {
	ExitIdleMode() error
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
	EnterIdleMode()
}

// Manager implements idleness detection and calls the configured Enforcer to
// enter/exit idle mode when appropriate.  Must be created by NewManager.
type Manager struct {
<<<<<<< HEAD
=======
=======
>>>>>>> master
	EnterIdleMode() error
}

// Manager defines the functionality required to track RPC activity on a
// channel.
type Manager interface {
	OnCallBegin() error
	OnCallEnd()
	Close()
}

type noopManager struct{}

func (noopManager) OnCallBegin() error { return nil }
func (noopManager) OnCallEnd()         {}
func (noopManager) Close()             {}

// manager implements the Manager interface. It uses atomic operations to
// synchronize access to shared state and a mutex to guarantee mutual exclusion
// in a critical section.
type manager struct {
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
	// State accessed atomically.
	lastCallEndTime           int64 // Unix timestamp in nanos; time when the most recent RPC completed.
	activeCallsCount          int32 // Count of active RPCs; -math.MaxInt32 means channel is idle or is trying to get there.
	activeSinceLastTimerCheck int32 // Boolean; True if there was an RPC since the last timer callback.
	closed                    int32 // Boolean; True when the manager is closed.

	// Can be accessed without atomics or mutex since these are set at creation
	// time and read-only after that.
	enforcer Enforcer // Functionality provided by grpc.ClientConn.
<<<<<<< HEAD
	timeout  time.Duration
=======
<<<<<<< HEAD
	timeout  int64    // Idle timeout duration nanos stored as an int64.
	logger   grpclog.LoggerV2
=======
<<<<<<< HEAD
	timeout  time.Duration
=======
	timeout  int64    // Idle timeout duration nanos stored as an int64.
	logger   grpclog.LoggerV2
>>>>>>> master
>>>>>>> master
>>>>>>> master

	// idleMu is used to guarantee mutual exclusion in two scenarios:
	// - Opposing intentions:
	//   - a: Idle timeout has fired and handleIdleTimeout() is trying to put
	//     the channel in idle mode because the channel has been inactive.
	//   - b: At the same time an RPC is made on the channel, and OnCallBegin()
	//     is trying to prevent the channel from going idle.
	// - Competing intentions:
	//   - The channel is in idle mode and there are multiple RPCs starting at
	//     the same time, all trying to move the channel out of idle. Only one
	//     of them should succeed in doing so, while the other RPCs should
	//     piggyback on the first one and be successfully handled.
	idleMu       sync.RWMutex
	actuallyIdle bool
	timer        *time.Timer
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
// NewManager creates a new idleness manager implementation for the
// given idle timeout.  It begins in idle mode.
func NewManager(enforcer Enforcer, timeout time.Duration) *Manager {
	return &Manager{
		enforcer:         enforcer,
		timeout:          timeout,
		actuallyIdle:     true,
		activeCallsCount: -math.MaxInt32,
	}
}

// resetIdleTimerLocked resets the idle timer to the given duration.  Called
// when exiting idle mode or when the timer fires and we need to reset it.
func (m *Manager) resetIdleTimerLocked(d time.Duration) {
	if m.isClosed() || m.timeout == 0 || m.actuallyIdle {
<<<<<<< HEAD
=======
=======
>>>>>>> master
// ManagerOptions is a collection of options used by
// NewManager.
type ManagerOptions struct {
	Enforcer Enforcer
	Timeout  time.Duration
	Logger   grpclog.LoggerV2
}

// NewManager creates a new idleness manager implementation for the
// given idle timeout.
func NewManager(opts ManagerOptions) Manager {
	if opts.Timeout == 0 {
		return noopManager{}
	}

	m := &manager{
		enforcer: opts.Enforcer,
		timeout:  int64(opts.Timeout),
		logger:   opts.Logger,
	}
	m.timer = timeAfterFunc(opts.Timeout, m.handleIdleTimeout)
	return m
}

// resetIdleTimer resets the idle timer to the given duration. This method
// should only be called from the timer callback.
func (m *manager) resetIdleTimer(d time.Duration) {
	m.idleMu.Lock()
	defer m.idleMu.Unlock()

	if m.timer == nil {
		// Only close sets timer to nil. We are done.
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
		return
	}

	// It is safe to ignore the return value from Reset() because this method is
<<<<<<< HEAD
=======
<<<<<<< HEAD
	// only ever called from the timer callback, which means the timer has
	// already fired.
	m.timer.Reset(d)
=======
<<<<<<< HEAD
>>>>>>> master
	// only ever called from the timer callback or when exiting idle mode.
	if m.timer != nil {
		m.timer.Stop()
	}
	m.timer = timeAfterFunc(d, m.handleIdleTimeout)
}

func (m *Manager) resetIdleTimer(d time.Duration) {
	m.idleMu.Lock()
	defer m.idleMu.Unlock()
	m.resetIdleTimerLocked(d)
<<<<<<< HEAD
=======
=======
	// only ever called from the timer callback, which means the timer has
	// already fired.
	m.timer.Reset(d)
>>>>>>> master
>>>>>>> master
>>>>>>> master
}

// handleIdleTimeout is the timer callback that is invoked upon expiry of the
// configured idle timeout. The channel is considered inactive if there are no
// ongoing calls and no RPC activity since the last time the timer fired.
<<<<<<< HEAD
func (m *Manager) handleIdleTimeout() {
=======
<<<<<<< HEAD
func (m *manager) handleIdleTimeout() {
=======
<<<<<<< HEAD
func (m *Manager) handleIdleTimeout() {
=======
func (m *manager) handleIdleTimeout() {
>>>>>>> master
>>>>>>> master
>>>>>>> master
	if m.isClosed() {
		return
	}

	if atomic.LoadInt32(&m.activeCallsCount) > 0 {
<<<<<<< HEAD
		m.resetIdleTimer(m.timeout)
=======
<<<<<<< HEAD
		m.resetIdleTimer(time.Duration(m.timeout))
=======
<<<<<<< HEAD
		m.resetIdleTimer(m.timeout)
=======
		m.resetIdleTimer(time.Duration(m.timeout))
>>>>>>> master
>>>>>>> master
>>>>>>> master
		return
	}

	// There has been activity on the channel since we last got here. Reset the
	// timer and return.
	if atomic.LoadInt32(&m.activeSinceLastTimerCheck) == 1 {
		// Set the timer to fire after a duration of idle timeout, calculated
		// from the time the most recent RPC completed.
		atomic.StoreInt32(&m.activeSinceLastTimerCheck, 0)
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
		m.resetIdleTimer(time.Duration(atomic.LoadInt64(&m.lastCallEndTime)-time.Now().UnixNano()) + m.timeout)
		return
	}

	// Now that we've checked that there has been no activity, attempt to enter
	// idle mode, which is very likely to succeed.
<<<<<<< HEAD
=======
=======
>>>>>>> master
		m.resetIdleTimer(time.Duration(atomic.LoadInt64(&m.lastCallEndTime) + m.timeout - time.Now().UnixNano()))
		return
	}

	// This CAS operation is extremely likely to succeed given that there has
	// been no activity since the last time we were here.  Setting the
	// activeCallsCount to -math.MaxInt32 indicates to OnCallBegin() that the
	// channel is either in idle mode or is trying to get there.
	if !atomic.CompareAndSwapInt32(&m.activeCallsCount, 0, -math.MaxInt32) {
		// This CAS operation can fail if an RPC started after we checked for
		// activity at the top of this method, or one was ongoing from before
		// the last time we were here. In both case, reset the timer and return.
		m.resetIdleTimer(time.Duration(m.timeout))
		return
	}

	// Now that we've set the active calls count to -math.MaxInt32, it's time to
	// actually move to idle mode.
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
	if m.tryEnterIdleMode() {
		// Successfully entered idle mode. No timer needed until we exit idle.
		return
	}

	// Failed to enter idle mode due to a concurrent RPC that kept the channel
	// active, or because of an error from the channel. Undo the attempt to
	// enter idle, and reset the timer to try again later.
<<<<<<< HEAD
	m.resetIdleTimer(m.timeout)
=======
<<<<<<< HEAD
	atomic.AddInt32(&m.activeCallsCount, math.MaxInt32)
	m.resetIdleTimer(time.Duration(m.timeout))
=======
<<<<<<< HEAD
	m.resetIdleTimer(m.timeout)
=======
	atomic.AddInt32(&m.activeCallsCount, math.MaxInt32)
	m.resetIdleTimer(time.Duration(m.timeout))
>>>>>>> master
>>>>>>> master
>>>>>>> master
}

// tryEnterIdleMode instructs the channel to enter idle mode. But before
// that, it performs a last minute check to ensure that no new RPC has come in,
// making the channel active.
//
// Return value indicates whether or not the channel moved to idle mode.
//
// Holds idleMu which ensures mutual exclusion with exitIdleMode.
<<<<<<< HEAD
=======
<<<<<<< HEAD
func (m *manager) tryEnterIdleMode() bool {
=======
<<<<<<< HEAD
>>>>>>> master
func (m *Manager) tryEnterIdleMode() bool {
	// Setting the activeCallsCount to -math.MaxInt32 indicates to OnCallBegin()
	// that the channel is either in idle mode or is trying to get there.
	if !atomic.CompareAndSwapInt32(&m.activeCallsCount, 0, -math.MaxInt32) {
		// This CAS operation can fail if an RPC started after we checked for
		// activity in the timer handler, or one was ongoing from before the
		// last time the timer fired, or if a test is attempting to enter idle
		// mode without checking.  In all cases, abort going into idle mode.
		return false
	}
	// N.B. if we fail to enter idle mode after this, we must re-add
	// math.MaxInt32 to m.activeCallsCount.

<<<<<<< HEAD
=======
=======
func (m *manager) tryEnterIdleMode() bool {
>>>>>>> master
>>>>>>> master
>>>>>>> master
	m.idleMu.Lock()
	defer m.idleMu.Unlock()

	if atomic.LoadInt32(&m.activeCallsCount) != -math.MaxInt32 {
		// We raced and lost to a new RPC. Very rare, but stop entering idle.
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
		atomic.AddInt32(&m.activeCallsCount, math.MaxInt32)
		return false
	}
	if atomic.LoadInt32(&m.activeSinceLastTimerCheck) == 1 {
		// A very short RPC could have come in (and also finished) after we
		// checked for calls count and activity in handleIdleTimeout(), but
		// before the CAS operation. So, we need to check for activity again.
		atomic.AddInt32(&m.activeCallsCount, math.MaxInt32)
		return false
	}

	// No new RPCs have come in since we set the active calls count value to
	// -math.MaxInt32. And since we have the lock, it is safe to enter idle mode
	// unconditionally now.
	m.enforcer.EnterIdleMode()
<<<<<<< HEAD
=======
=======
>>>>>>> master
		return false
	}
	if atomic.LoadInt32(&m.activeSinceLastTimerCheck) == 1 {
		// An very short RPC could have come in (and also finished) after we
		// checked for calls count and activity in handleIdleTimeout(), but
		// before the CAS operation. So, we need to check for activity again.
		return false
	}

	// No new RPCs have come in since we last set the active calls count value
	// -math.MaxInt32 in the timer callback. And since we have the lock, it is
	// safe to enter idle mode now.
	if err := m.enforcer.EnterIdleMode(); err != nil {
		m.logger.Errorf("Failed to enter idle mode: %v", err)
		return false
	}

	// Successfully entered idle mode.
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
	m.actuallyIdle = true
	return true
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
// OnCallBegin is invoked at the start of every RPC.
func (m *manager) OnCallBegin() error {
=======
<<<<<<< HEAD
>>>>>>> master
func (m *Manager) EnterIdleModeForTesting() {
	m.tryEnterIdleMode()
}

// OnCallBegin is invoked at the start of every RPC.
func (m *Manager) OnCallBegin() error {
<<<<<<< HEAD
=======
=======
// OnCallBegin is invoked at the start of every RPC.
func (m *manager) OnCallBegin() error {
>>>>>>> master
>>>>>>> master
>>>>>>> master
	if m.isClosed() {
		return nil
	}

	if atomic.AddInt32(&m.activeCallsCount, 1) > 0 {
		// Channel is not idle now. Set the activity bit and allow the call.
		atomic.StoreInt32(&m.activeSinceLastTimerCheck, 1)
		return nil
	}

	// Channel is either in idle mode or is in the process of moving to idle
	// mode. Attempt to exit idle mode to allow this RPC.
<<<<<<< HEAD
	if err := m.ExitIdleMode(); err != nil {
=======
<<<<<<< HEAD
	if err := m.exitIdleMode(); err != nil {
=======
<<<<<<< HEAD
	if err := m.ExitIdleMode(); err != nil {
=======
	if err := m.exitIdleMode(); err != nil {
>>>>>>> master
>>>>>>> master
>>>>>>> master
		// Undo the increment to calls count, and return an error causing the
		// RPC to fail.
		atomic.AddInt32(&m.activeCallsCount, -1)
		return err
	}

	atomic.StoreInt32(&m.activeSinceLastTimerCheck, 1)
	return nil
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
// ExitIdleMode instructs m to call the enforcer's ExitIdleMode and update m's
// internal state.
func (m *Manager) ExitIdleMode() error {
	// Holds idleMu which ensures mutual exclusion with tryEnterIdleMode.
	m.idleMu.Lock()
	defer m.idleMu.Unlock()

	if m.isClosed() || !m.actuallyIdle {
		// This can happen in three scenarios:
<<<<<<< HEAD
=======
=======
>>>>>>> master
// exitIdleMode instructs the channel to exit idle mode.
//
// Holds idleMu which ensures mutual exclusion with tryEnterIdleMode.
func (m *manager) exitIdleMode() error {
	m.idleMu.Lock()
	defer m.idleMu.Unlock()

	if !m.actuallyIdle {
		// This can happen in two scenarios:
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
		// - handleIdleTimeout() set the calls count to -math.MaxInt32 and called
		//   tryEnterIdleMode(). But before the latter could grab the lock, an RPC
		//   came in and OnCallBegin() noticed that the calls count is negative.
		// - Channel is in idle mode, and multiple new RPCs come in at the same
		//   time, all of them notice a negative calls count in OnCallBegin and get
		//   here. The first one to get the lock would got the channel to exit idle.
<<<<<<< HEAD
=======
<<<<<<< HEAD
		//
		// Either way, nothing to do here.
=======
<<<<<<< HEAD
>>>>>>> master
		// - Channel is not in idle mode, and the user calls Connect which calls
		//   m.ExitIdleMode.
		//
		// In any case, there is nothing to do here.
<<<<<<< HEAD
=======
=======
		//
		// Either way, nothing to do here.
>>>>>>> master
>>>>>>> master
>>>>>>> master
		return nil
	}

	if err := m.enforcer.ExitIdleMode(); err != nil {
<<<<<<< HEAD
		return fmt.Errorf("failed to exit idle mode: %w", err)
=======
<<<<<<< HEAD
		return fmt.Errorf("channel failed to exit idle mode: %v", err)
=======
<<<<<<< HEAD
		return fmt.Errorf("failed to exit idle mode: %w", err)
=======
		return fmt.Errorf("channel failed to exit idle mode: %v", err)
>>>>>>> master
>>>>>>> master
>>>>>>> master
	}

	// Undo the idle entry process. This also respects any new RPC attempts.
	atomic.AddInt32(&m.activeCallsCount, math.MaxInt32)
	m.actuallyIdle = false

	// Start a new timer to fire after the configured idle timeout.
<<<<<<< HEAD
	m.resetIdleTimerLocked(m.timeout)
=======
<<<<<<< HEAD
	m.timer = timeAfterFunc(time.Duration(m.timeout), m.handleIdleTimeout)
=======
<<<<<<< HEAD
	m.resetIdleTimerLocked(m.timeout)
=======
	m.timer = timeAfterFunc(time.Duration(m.timeout), m.handleIdleTimeout)
>>>>>>> master
>>>>>>> master
>>>>>>> master
	return nil
}

// OnCallEnd is invoked at the end of every RPC.
<<<<<<< HEAD
func (m *Manager) OnCallEnd() {
=======
<<<<<<< HEAD
func (m *manager) OnCallEnd() {
=======
<<<<<<< HEAD
func (m *Manager) OnCallEnd() {
=======
func (m *manager) OnCallEnd() {
>>>>>>> master
>>>>>>> master
>>>>>>> master
	if m.isClosed() {
		return
	}

	// Record the time at which the most recent call finished.
	atomic.StoreInt64(&m.lastCallEndTime, time.Now().UnixNano())

	// Decrement the active calls count. This count can temporarily go negative
	// when the timer callback is in the process of moving the channel to idle
	// mode, but one or more RPCs come in and complete before the timer callback
	// can get done with the process of moving to idle mode.
	atomic.AddInt32(&m.activeCallsCount, -1)
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
func (m *Manager) isClosed() bool {
	return atomic.LoadInt32(&m.closed) == 1
}

func (m *Manager) Close() {
	atomic.StoreInt32(&m.closed, 1)

	m.idleMu.Lock()
	if m.timer != nil {
		m.timer.Stop()
		m.timer = nil
	}
<<<<<<< HEAD
=======
=======
>>>>>>> master
func (m *manager) isClosed() bool {
	return atomic.LoadInt32(&m.closed) == 1
}

func (m *manager) Close() {
	atomic.StoreInt32(&m.closed, 1)

	m.idleMu.Lock()
	m.timer.Stop()
	m.timer = nil
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
	m.idleMu.Unlock()
}