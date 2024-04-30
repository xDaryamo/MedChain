/*
 *
 * Copyright 2014 gRPC authors.
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

package grpc

import (
	"context"
	"errors"
	"io"
	"math"
	"strconv"
	"sync"
	"time"

<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
	"golang.org/x/net/trace"
=======
<<<<<<< HEAD
=======
	"golang.org/x/net/trace"
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
	"golang.org/x/net/trace"
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
	"google.golang.org/grpc/balancer"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/encoding"
	"google.golang.org/grpc/internal"
	"google.golang.org/grpc/internal/balancerload"
	"google.golang.org/grpc/internal/binarylog"
	"google.golang.org/grpc/internal/channelz"
	"google.golang.org/grpc/internal/grpcrand"
	"google.golang.org/grpc/internal/grpcutil"
	imetadata "google.golang.org/grpc/internal/metadata"
	iresolver "google.golang.org/grpc/internal/resolver"
	"google.golang.org/grpc/internal/serviceconfig"
	istatus "google.golang.org/grpc/internal/status"
	"google.golang.org/grpc/internal/transport"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/peer"
	"google.golang.org/grpc/stats"
	"google.golang.org/grpc/status"
)

<<<<<<< HEAD
<<<<<<< HEAD
var metadataFromOutgoingContextRaw = internal.FromOutgoingContextRaw.(func(context.Context) (metadata.MD, [][]string, bool))

=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
var metadataFromOutgoingContextRaw = internal.FromOutgoingContextRaw.(func(context.Context) (metadata.MD, [][]string, bool))

=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
// StreamHandler defines the handler called by gRPC server to complete the
// execution of a streaming RPC.
//
// If a StreamHandler returns an error, it should either be produced by the
// status package, or be one of the context errors. Otherwise, gRPC will use
// codes.Unknown as the status code and err.Error() as the status message of the
// RPC.
type StreamHandler func(srv any, stream ServerStream) error

// StreamDesc represents a streaming RPC service's method specification.  Used
// on the server when registering services and on the client when initiating
// new streams.
type StreamDesc struct {
	// StreamName and Handler are only used when registering handlers on a
	// server.
	StreamName string        // the name of the method excluding the service
	Handler    StreamHandler // the handler called for the method

	// ServerStreams and ClientStreams are used for registering handlers on a
	// server as well as defining RPC behavior when passed to NewClientStream
	// and ClientConn.NewStream.  At least one must be true.
	ServerStreams bool // indicates the server can perform streaming sends
	ClientStreams bool // indicates the client can perform streaming sends
}

// Stream defines the common interface a client or server stream has to satisfy.
//
// Deprecated: See ClientStream and ServerStream documentation instead.
type Stream interface {
	// Deprecated: See ClientStream and ServerStream documentation instead.
	Context() context.Context
	// Deprecated: See ClientStream and ServerStream documentation instead.
	SendMsg(m any) error
	// Deprecated: See ClientStream and ServerStream documentation instead.
	RecvMsg(m any) error
}

// ClientStream defines the client-side behavior of a streaming RPC.
//
// All errors returned from ClientStream methods are compatible with the
// status package.
type ClientStream interface {
	// Header returns the header metadata received from the server if there
	// is any. It blocks if the metadata is not ready to read.  If the metadata
	// is nil and the error is also nil, then the stream was terminated without
	// headers, and the status can be discovered by calling RecvMsg.
	Header() (metadata.MD, error)
	// Trailer returns the trailer metadata from the server, if there is any.
	// It must only be called after stream.CloseAndRecv has returned, or
	// stream.Recv has returned a non-nil error (including io.EOF).
	Trailer() metadata.MD
	// CloseSend closes the send direction of the stream. It closes the stream
	// when non-nil error is met. It is also not safe to call CloseSend
	// concurrently with SendMsg.
	CloseSend() error
	// Context returns the context for this stream.
	//
	// It should not be called until after Header or RecvMsg has returned. Once
	// called, subsequent client-side retries are disabled.
	Context() context.Context
	// SendMsg is generally called by generated code. On error, SendMsg aborts
	// the stream. If the error was generated by the client, the status is
	// returned directly; otherwise, io.EOF is returned and the status of
	// the stream may be discovered using RecvMsg.
	//
	// SendMsg blocks until:
	//   - There is sufficient flow control to schedule m with the transport, or
	//   - The stream is done, or
	//   - The stream breaks.
	//
	// SendMsg does not wait until the message is received by the server. An
	// untimely stream closure may result in lost messages. To ensure delivery,
	// users should ensure the RPC completed successfully using RecvMsg.
	//
	// It is safe to have a goroutine calling SendMsg and another goroutine
	// calling RecvMsg on the same stream at the same time, but it is not safe
	// to call SendMsg on the same stream in different goroutines. It is also
	// not safe to call CloseSend concurrently with SendMsg.
	//
	// It is not safe to modify the message after calling SendMsg. Tracing
	// libraries and stats handlers may use the message lazily.
	SendMsg(m any) error
	// RecvMsg blocks until it receives a message into m or the stream is
	// done. It returns io.EOF when the stream completes successfully. On
	// any other error, the stream is aborted and the error contains the RPC
	// status.
	//
	// It is safe to have a goroutine calling SendMsg and another goroutine
	// calling RecvMsg on the same stream at the same time, but it is not
	// safe to call RecvMsg on the same stream in different goroutines.
	RecvMsg(m any) error
}

// NewStream creates a new Stream for the client side. This is typically
// called by generated code. ctx is used for the lifetime of the stream.
//
// To ensure resources are not leaked due to the stream returned, one of the following
// actions must be performed:
//
//  1. Call Close on the ClientConn.
//  2. Cancel the context provided.
//  3. Call RecvMsg until a non-nil error is returned. A protobuf-generated
//     client-streaming RPC, for instance, might use the helper function
//     CloseAndRecv (note that CloseSend does not Recv, therefore is not
//     guaranteed to release all resources).
//  4. Receive a non-nil, non-io.EOF error from Header or SendMsg.
//
// If none of the above happen, a goroutine and a context will be leaked, and grpc
// will not call the optionally-configured stats handler with a stats.End message.
func (cc *ClientConn) NewStream(ctx context.Context, desc *StreamDesc, method string, opts ...CallOption) (ClientStream, error) {
	// allow interceptor to see all applicable call options, which means those
	// configured as defaults from dial option as well as per-call options
	opts = combine(cc.dopts.callOptions, opts)

	if cc.dopts.streamInt != nil {
		return cc.dopts.streamInt(ctx, desc, cc, method, newClientStream, opts...)
	}
	return newClientStream(ctx, desc, cc, method, opts...)
}

// NewClientStream is a wrapper for ClientConn.NewStream.
func NewClientStream(ctx context.Context, desc *StreamDesc, cc *ClientConn, method string, opts ...CallOption) (ClientStream, error) {
	return cc.NewStream(ctx, desc, method, opts...)
}

func newClientStream(ctx context.Context, desc *StreamDesc, cc *ClientConn, method string, opts ...CallOption) (_ ClientStream, err error) {
	// Start tracking the RPC for idleness purposes. This is where a stream is
	// created for both streaming and unary RPCs, and hence is a good place to
	// track active RPC count.
	if err := cc.idlenessMgr.OnCallBegin(); err != nil {
		return nil, err
	}
	// Add a calloption, to decrement the active call count, that gets executed
	// when the RPC completes.
	opts = append([]CallOption{OnFinish(func(error) { cc.idlenessMgr.OnCallEnd() })}, opts...)

<<<<<<< HEAD
<<<<<<< HEAD
	if md, added, ok := metadataFromOutgoingContextRaw(ctx); ok {
=======
<<<<<<< HEAD
	if md, added, ok := metadata.FromOutgoingContextRaw(ctx); ok {
=======
<<<<<<< HEAD
	if md, added, ok := metadataFromOutgoingContextRaw(ctx); ok {
=======
	if md, added, ok := metadata.FromOutgoingContextRaw(ctx); ok {
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
	if md, added, ok := metadata.FromOutgoingContextRaw(ctx); ok {
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
		// validate md
		if err := imetadata.Validate(md); err != nil {
			return nil, status.Error(codes.Internal, err.Error())
		}
		// validate added
		for _, kvs := range added {
			for i := 0; i < len(kvs); i += 2 {
				if err := imetadata.ValidatePair(kvs[i], kvs[i+1]); err != nil {
					return nil, status.Error(codes.Internal, err.Error())
				}
			}
		}
	}
	if channelz.IsOn() {
		cc.incrCallsStarted()
		defer func() {
			if err != nil {
				cc.incrCallsFailed()
			}
		}()
	}
	// Provide an opportunity for the first RPC to see the first service config
	// provided by the resolver.
	if err := cc.waitForResolvedAddrs(ctx); err != nil {
		return nil, err
	}

	var mc serviceconfig.MethodConfig
	var onCommit func()
	var newStream = func(ctx context.Context, done func()) (iresolver.ClientStream, error) {
		return newClientStreamWithParams(ctx, desc, cc, method, mc, onCommit, done, opts...)
	}

	rpcInfo := iresolver.RPCInfo{Context: ctx, Method: method}
	rpcConfig, err := cc.safeConfigSelector.SelectConfig(rpcInfo)
	if err != nil {
		if st, ok := status.FromError(err); ok {
			// Restrict the code to the list allowed by gRFC A54.
			if istatus.IsRestrictedControlPlaneCode(st) {
				err = status.Errorf(codes.Internal, "config selector returned illegal status: %v", err)
			}
			return nil, err
		}
		return nil, toRPCErr(err)
	}

	if rpcConfig != nil {
		if rpcConfig.Context != nil {
			ctx = rpcConfig.Context
		}
		mc = rpcConfig.MethodConfig
		onCommit = rpcConfig.OnCommitted
		if rpcConfig.Interceptor != nil {
			rpcInfo.Context = nil
			ns := newStream
			newStream = func(ctx context.Context, done func()) (iresolver.ClientStream, error) {
				cs, err := rpcConfig.Interceptor.NewStream(ctx, rpcInfo, done, ns)
				if err != nil {
					return nil, toRPCErr(err)
				}
				return cs, nil
			}
		}
	}

	return newStream(ctx, func() {})
}

func newClientStreamWithParams(ctx context.Context, desc *StreamDesc, cc *ClientConn, method string, mc serviceconfig.MethodConfig, onCommit, doneFunc func(), opts ...CallOption) (_ iresolver.ClientStream, err error) {
	c := defaultCallInfo()
	if mc.WaitForReady != nil {
		c.failFast = !*mc.WaitForReady
	}

	// Possible context leak:
	// The cancel function for the child context we create will only be called
	// when RecvMsg returns a non-nil error, if the ClientConn is closed, or if
	// an error is generated by SendMsg.
	// https://github.com/grpc/grpc-go/issues/1818.
	var cancel context.CancelFunc
	if mc.Timeout != nil && *mc.Timeout >= 0 {
		ctx, cancel = context.WithTimeout(ctx, *mc.Timeout)
	} else {
		ctx, cancel = context.WithCancel(ctx)
	}
	defer func() {
		if err != nil {
			cancel()
		}
	}()

	for _, o := range opts {
		if err := o.before(c); err != nil {
			return nil, toRPCErr(err)
		}
	}
	c.maxSendMessageSize = getMaxSize(mc.MaxReqSize, c.maxSendMessageSize, defaultClientMaxSendMessageSize)
	c.maxReceiveMessageSize = getMaxSize(mc.MaxRespSize, c.maxReceiveMessageSize, defaultClientMaxReceiveMessageSize)
	if err := setCallInfoCodec(c); err != nil {
		return nil, err
	}

	callHdr := &transport.CallHdr{
		Host:           cc.authority,
		Method:         method,
		ContentSubtype: c.contentSubtype,
		DoneFunc:       doneFunc,
	}

	// Set our outgoing compression according to the UseCompressor CallOption, if
	// set.  In that case, also find the compressor from the encoding package.
	// Otherwise, use the compressor configured by the WithCompressor DialOption,
	// if set.
	var cp Compressor
	var comp encoding.Compressor
	if ct := c.compressorType; ct != "" {
		callHdr.SendCompress = ct
		if ct != encoding.Identity {
			comp = encoding.GetCompressor(ct)
			if comp == nil {
				return nil, status.Errorf(codes.Internal, "grpc: Compressor is not installed for requested grpc-encoding %q", ct)
			}
		}
	} else if cc.dopts.cp != nil {
		callHdr.SendCompress = cc.dopts.cp.Type()
		cp = cc.dopts.cp
	}
	if c.creds != nil {
		callHdr.Creds = c.creds
	}

	cs := &clientStream{
		callHdr:      callHdr,
		ctx:          ctx,
		methodConfig: &mc,
		opts:         opts,
		callInfo:     c,
		cc:           cc,
		desc:         desc,
		codec:        c.codec,
		cp:           cp,
		comp:         comp,
		cancel:       cancel,
		firstAttempt: true,
		onCommit:     onCommit,
	}
	if !cc.dopts.disableRetry {
		cs.retryThrottler = cc.retryThrottler.Load().(*retryThrottler)
	}
	if ml := binarylog.GetMethodLogger(method); ml != nil {
		cs.binlogs = append(cs.binlogs, ml)
	}
	if cc.dopts.binaryLogger != nil {
		if ml := cc.dopts.binaryLogger.GetMethodLogger(method); ml != nil {
			cs.binlogs = append(cs.binlogs, ml)
		}
	}

	// Pick the transport to use and create a new stream on the transport.
	// Assign cs.attempt upon success.
	op := func(a *csAttempt) error {
		if err := a.getTransport(); err != nil {
			return err
		}
		if err := a.newStream(); err != nil {
			return err
		}
		// Because this operation is always called either here (while creating
		// the clientStream) or by the retry code while locked when replaying
		// the operation, it is safe to access cs.attempt directly.
		cs.attempt = a
		return nil
	}
	if err := cs.withRetry(op, func() { cs.bufferForRetryLocked(0, op) }); err != nil {
		return nil, err
	}

	if len(cs.binlogs) != 0 {
		md, _ := metadata.FromOutgoingContext(ctx)
		logEntry := &binarylog.ClientHeader{
			OnClientSide: true,
			Header:       md,
			MethodName:   method,
			Authority:    cs.cc.authority,
		}
		if deadline, ok := ctx.Deadline(); ok {
			logEntry.Timeout = time.Until(deadline)
			if logEntry.Timeout < 0 {
				logEntry.Timeout = 0
			}
		}
		for _, binlog := range cs.binlogs {
			binlog.Log(cs.ctx, logEntry)
		}
	}

	if desc != unaryStreamDesc {
		// Listen on cc and stream contexts to cleanup when the user closes the
		// ClientConn or cancels the stream context.  In all other cases, an error
		// should already be injected into the recv buffer by the transport, which
		// the client will eventually receive, and then we will cancel the stream's
		// context in clientStream.finish.
		go func() {
			select {
			case <-cc.ctx.Done():
				cs.finish(ErrClientConnClosing)
			case <-ctx.Done():
				cs.finish(toRPCErr(ctx.Err()))
			}
		}()
	}
	return cs, nil
}

// newAttemptLocked creates a new csAttempt without a transport or stream.
func (cs *clientStream) newAttemptLocked(isTransparent bool) (*csAttempt, error) {
	if err := cs.ctx.Err(); err != nil {
		return nil, toRPCErr(err)
	}
	if err := cs.cc.ctx.Err(); err != nil {
		return nil, ErrClientConnClosing
	}

	ctx := newContextWithRPCInfo(cs.ctx, cs.callInfo.failFast, cs.callInfo.codec, cs.cp, cs.comp)
	method := cs.callHdr.Method
	var beginTime time.Time
	shs := cs.cc.dopts.copts.StatsHandlers
	for _, sh := range shs {
		ctx = sh.TagRPC(ctx, &stats.RPCTagInfo{FullMethodName: method, FailFast: cs.callInfo.failFast})
		beginTime = time.Now()
		begin := &stats.Begin{
			Client:                    true,
			BeginTime:                 beginTime,
			FailFast:                  cs.callInfo.failFast,
			IsClientStream:            cs.desc.ClientStreams,
			IsServerStream:            cs.desc.ServerStreams,
			IsTransparentRetryAttempt: isTransparent,
		}
		sh.HandleRPC(ctx, begin)
	}

	var trInfo *traceInfo
	if EnableTracing {
		trInfo = &traceInfo{
<<<<<<< HEAD
<<<<<<< HEAD
			tr: newTrace("grpc.Sent."+methodFamily(method), method),
=======
<<<<<<< HEAD
			tr: trace.New("grpc.Sent."+methodFamily(method), method),
=======
<<<<<<< HEAD
			tr: newTrace("grpc.Sent."+methodFamily(method), method),
=======
			tr: trace.New("grpc.Sent."+methodFamily(method), method),
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
			tr: trace.New("grpc.Sent."+methodFamily(method), method),
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
			firstLine: firstLine{
				client: true,
			},
		}
		if deadline, ok := ctx.Deadline(); ok {
			trInfo.firstLine.deadline = time.Until(deadline)
		}
		trInfo.tr.LazyLog(&trInfo.firstLine, false)
<<<<<<< HEAD
<<<<<<< HEAD
		ctx = newTraceContext(ctx, trInfo.tr)
=======
<<<<<<< HEAD
		ctx = trace.NewContext(ctx, trInfo.tr)
=======
<<<<<<< HEAD
		ctx = newTraceContext(ctx, trInfo.tr)
=======
		ctx = trace.NewContext(ctx, trInfo.tr)
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
		ctx = trace.NewContext(ctx, trInfo.tr)
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
	}

	if cs.cc.parsedTarget.URL.Scheme == internal.GRPCResolverSchemeExtraMetadata {
		// Add extra metadata (metadata that will be added by transport) to context
		// so the balancer can see them.
		ctx = grpcutil.WithExtraMetadata(ctx, metadata.Pairs(
			"content-type", grpcutil.ContentType(cs.callHdr.ContentSubtype),
		))
	}

	return &csAttempt{
		ctx:           ctx,
		beginTime:     beginTime,
		cs:            cs,
		dc:            cs.cc.dopts.dc,
		statsHandlers: shs,
		trInfo:        trInfo,
	}, nil
}

func (a *csAttempt) getTransport() error {
	cs := a.cs

	var err error
	a.t, a.pickResult, err = cs.cc.getTransport(a.ctx, cs.callInfo.failFast, cs.callHdr.Method)
	if err != nil {
		if de, ok := err.(dropError); ok {
			err = de.error
			a.drop = true
		}
		return err
	}
	if a.trInfo != nil {
		a.trInfo.firstLine.SetRemoteAddr(a.t.RemoteAddr())
	}
	return nil
}

func (a *csAttempt) newStream() error {
	cs := a.cs
	cs.callHdr.PreviousAttempts = cs.numRetries

	// Merge metadata stored in PickResult, if any, with existing call metadata.
	// It is safe to overwrite the csAttempt's context here, since all state
	// maintained in it are local to the attempt. When the attempt has to be
	// retried, a new instance of csAttempt will be created.
	if a.pickResult.Metadata != nil {
		// We currently do not have a function it the metadata package which
		// merges given metadata with existing metadata in a context. Existing
		// function `AppendToOutgoingContext()` takes a variadic argument of key
		// value pairs.
		//
		// TODO: Make it possible to retrieve key value pairs from metadata.MD
		// in a form passable to AppendToOutgoingContext(), or create a version
		// of AppendToOutgoingContext() that accepts a metadata.MD.
		md, _ := metadata.FromOutgoingContext(a.ctx)
		md = metadata.Join(md, a.pickResult.Metadata)
		a.ctx = metadata.NewOutgoingContext(a.ctx, md)
	}

	s, err := a.t.NewStream(a.ctx, cs.callHdr)
	if err != nil {
		nse, ok := err.(*transport.NewStreamError)
		if !ok {
			// Unexpected.
			return err
		}

		if nse.AllowTransparentRetry {
			a.allowTransparentRetry = true
		}

		// Unwrap and convert error.
		return toRPCErr(nse.Err)
	}
	a.s = s
	a.p = &parser{r: s, recvBufferPool: a.cs.cc.dopts.recvBufferPool}
	return nil
}

// clientStream implements a client side Stream.
type clientStream struct {
	callHdr  *transport.CallHdr
	opts     []CallOption
	callInfo *callInfo
	cc       *ClientConn
	desc     *StreamDesc

	codec baseCodec
	cp    Compressor
	comp  encoding.Compressor

	cancel context.CancelFunc // cancels all attempts

	sentLast bool // sent an end stream

	methodConfig *MethodConfig

	ctx context.Context // the application's context, wrapped by stats/tracing

	retryThrottler *retryThrottler // The throttler active when the RPC began.

	binlogs []binarylog.MethodLogger
	// serverHeaderBinlogged is a boolean for whether server header has been
	// logged. Server header will be logged when the first time one of those
	// happens: stream.Header(), stream.Recv().
	//
	// It's only read and used by Recv() and Header(), so it doesn't need to be
	// synchronized.
	serverHeaderBinlogged bool

	mu                      sync.Mutex
	firstAttempt            bool // if true, transparent retry is valid
	numRetries              int  // exclusive of transparent retry attempt(s)
	numRetriesSincePushback int  // retries since pushback; to reset backoff
	finished                bool // TODO: replace with atomic cmpxchg or sync.Once?
	// attempt is the active client stream attempt.
	// The only place where it is written is the newAttemptLocked method and this method never writes nil.
	// So, attempt can be nil only inside newClientStream function when clientStream is first created.
	// One of the first things done after clientStream's creation, is to call newAttemptLocked which either
	// assigns a non nil value to the attempt or returns an error. If an error is returned from newAttemptLocked,
	// then newClientStream calls finish on the clientStream and returns. So, finish method is the only
	// place where we need to check if the attempt is nil.
	attempt *csAttempt
	// TODO(hedging): hedging will have multiple attempts simultaneously.
	committed  bool // active attempt committed for retry?
	onCommit   func()
	buffer     []func(a *csAttempt) error // operations to replay on retry
	bufferSize int                        // current size of buffer
}

// csAttempt implements a single transport stream attempt within a
// clientStream.
type csAttempt struct {
	ctx        context.Context
	cs         *clientStream
	t          transport.ClientTransport
	s          *transport.Stream
	p          *parser
	pickResult balancer.PickResult

	finished  bool
	dc        Decompressor
	decomp    encoding.Compressor
	decompSet bool

	mu sync.Mutex // guards trInfo.tr
	// trInfo may be nil (if EnableTracing is false).
	// trInfo.tr is set when created (if EnableTracing is true),
	// and cleared when the finish method is called.
	trInfo *traceInfo

	statsHandlers []stats.Handler
	beginTime     time.Time

	// set for newStream errors that may be transparently retried
	allowTransparentRetry bool
	// set for pick errors that are returned as a status
	drop bool
}

func (cs *clientStream) commitAttemptLocked() {
	if !cs.committed && cs.onCommit != nil {
		cs.onCommit()
	}
	cs.committed = true
	cs.buffer = nil
}

func (cs *clientStream) commitAttempt() {
	cs.mu.Lock()
	cs.commitAttemptLocked()
	cs.mu.Unlock()
}

// shouldRetry returns nil if the RPC should be retried; otherwise it returns
// the error that should be returned by the operation.  If the RPC should be
// retried, the bool indicates whether it is being retried transparently.
func (a *csAttempt) shouldRetry(err error) (bool, error) {
	cs := a.cs

	if cs.finished || cs.committed || a.drop {
		// RPC is finished or committed or was dropped by the picker; cannot retry.
		return false, err
	}
	if a.s == nil && a.allowTransparentRetry {
		return true, nil
	}
	// Wait for the trailers.
	unprocessed := false
	if a.s != nil {
		<-a.s.Done()
		unprocessed = a.s.Unprocessed()
	}
	if cs.firstAttempt && unprocessed {
		// First attempt, stream unprocessed: transparently retry.
		return true, nil
	}
	if cs.cc.dopts.disableRetry {
		return false, err
	}

	pushback := 0
	hasPushback := false
	if a.s != nil {
		if !a.s.TrailersOnly() {
			return false, err
		}

		// TODO(retry): Move down if the spec changes to not check server pushback
		// before considering this a failure for throttling.
		sps := a.s.Trailer()["grpc-retry-pushback-ms"]
		if len(sps) == 1 {
			var e error
			if pushback, e = strconv.Atoi(sps[0]); e != nil || pushback < 0 {
<<<<<<< HEAD
<<<<<<< HEAD
				channelz.Infof(logger, cs.cc.channelz, "Server retry pushback specified to abort (%q).", sps[0])
=======
<<<<<<< HEAD
				channelz.Infof(logger, cs.cc.channelzID, "Server retry pushback specified to abort (%q).", sps[0])
=======
<<<<<<< HEAD
				channelz.Infof(logger, cs.cc.channelz, "Server retry pushback specified to abort (%q).", sps[0])
=======
				channelz.Infof(logger, cs.cc.channelzID, "Server retry pushback specified to abort (%q).", sps[0])
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
				channelz.Infof(logger, cs.cc.channelzID, "Server retry pushback specified to abort (%q).", sps[0])
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
				cs.retryThrottler.throttle() // This counts as a failure for throttling.
				return false, err
			}
			hasPushback = true
		} else if len(sps) > 1 {
<<<<<<< HEAD
<<<<<<< HEAD
			channelz.Warningf(logger, cs.cc.channelz, "Server retry pushback specified multiple values (%q); not retrying.", sps)
=======
<<<<<<< HEAD
			channelz.Warningf(logger, cs.cc.channelzID, "Server retry pushback specified multiple values (%q); not retrying.", sps)
=======
<<<<<<< HEAD
			channelz.Warningf(logger, cs.cc.channelz, "Server retry pushback specified multiple values (%q); not retrying.", sps)
=======
			channelz.Warningf(logger, cs.cc.channelzID, "Server retry pushback specified multiple values (%q); not retrying.", sps)
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
			channelz.Warningf(logger, cs.cc.channelzID, "Server retry pushback specified multiple values (%q); not retrying.", sps)
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
			cs.retryThrottler.throttle() // This counts as a failure for throttling.
			return false, err
		}
	}

	var code codes.Code
	if a.s != nil {
		code = a.s.Status().Code()
	} else {
		code = status.Code(err)
	}

	rp := cs.methodConfig.RetryPolicy
	if rp == nil || !rp.RetryableStatusCodes[code] {
		return false, err
	}

	// Note: the ordering here is important; we count this as a failure
	// only if the code matched a retryable code.
	if cs.retryThrottler.throttle() {
		return false, err
	}
	if cs.numRetries+1 >= rp.MaxAttempts {
		return false, err
	}

	var dur time.Duration
	if hasPushback {
		dur = time.Millisecond * time.Duration(pushback)
		cs.numRetriesSincePushback = 0
	} else {
		fact := math.Pow(rp.BackoffMultiplier, float64(cs.numRetriesSincePushback))
		cur := float64(rp.InitialBackoff) * fact
		if max := float64(rp.MaxBackoff); cur > max {
			cur = max
		}
		dur = time.Duration(grpcrand.Int63n(int64(cur)))
		cs.numRetriesSincePushback++
	}

	// TODO(dfawley): we could eagerly fail here if dur puts us past the
	// deadline, but unsure if it is worth doing.
	t := time.NewTimer(dur)
	select {
	case <-t.C:
		cs.numRetries++
		return false, nil
	case <-cs.ctx.Done():
		t.Stop()
		return false, status.FromContextError(cs.ctx.Err()).Err()
	}
}

// Returns nil if a retry was performed and succeeded; error otherwise.
func (cs *clientStream) retryLocked(attempt *csAttempt, lastErr error) error {
	for {
		attempt.finish(toRPCErr(lastErr))
		isTransparent, err := attempt.shouldRetry(lastErr)
		if err != nil {
			cs.commitAttemptLocked()
			return err
		}
		cs.firstAttempt = false
		attempt, err = cs.newAttemptLocked(isTransparent)
		if err != nil {
			// Only returns error if the clientconn is closed or the context of
			// the stream is canceled.
			return err
		}
		// Note that the first op in the replay buffer always sets cs.attempt
		// if it is able to pick a transport and create a stream.
		if lastErr = cs.replayBufferLocked(attempt); lastErr == nil {
			return nil
		}
	}
}

func (cs *clientStream) Context() context.Context {
	cs.commitAttempt()
	// No need to lock before using attempt, since we know it is committed and
	// cannot change.
	if cs.attempt.s != nil {
		return cs.attempt.s.Context()
	}
	return cs.ctx
}

func (cs *clientStream) withRetry(op func(a *csAttempt) error, onSuccess func()) error {
	cs.mu.Lock()
	for {
		if cs.committed {
			cs.mu.Unlock()
			// toRPCErr is used in case the error from the attempt comes from
			// NewClientStream, which intentionally doesn't return a status
			// error to allow for further inspection; all other errors should
			// already be status errors.
			return toRPCErr(op(cs.attempt))
		}
		if len(cs.buffer) == 0 {
			// For the first op, which controls creation of the stream and
			// assigns cs.attempt, we need to create a new attempt inline
			// before executing the first op.  On subsequent ops, the attempt
			// is created immediately before replaying the ops.
			var err error
			if cs.attempt, err = cs.newAttemptLocked(false /* isTransparent */); err != nil {
				cs.mu.Unlock()
				cs.finish(err)
				return err
			}
		}
		a := cs.attempt
		cs.mu.Unlock()
		err := op(a)
		cs.mu.Lock()
		if a != cs.attempt {
			// We started another attempt already.
			continue
		}
		if err == io.EOF {
			<-a.s.Done()
		}
		if err == nil || (err == io.EOF && a.s.Status().Code() == codes.OK) {
			onSuccess()
			cs.mu.Unlock()
			return err
		}
		if err := cs.retryLocked(a, err); err != nil {
			cs.mu.Unlock()
			return err
		}
	}
}

func (cs *clientStream) Header() (metadata.MD, error) {
	var m metadata.MD
	err := cs.withRetry(func(a *csAttempt) error {
		var err error
		m, err = a.s.Header()
		return toRPCErr(err)
	}, cs.commitAttemptLocked)

	if m == nil && err == nil {
		// The stream ended with success.  Finish the clientStream.
		err = io.EOF
	}

	if err != nil {
		cs.finish(err)
		// Do not return the error.  The user should get it by calling Recv().
		return nil, nil
	}

	if len(cs.binlogs) != 0 && !cs.serverHeaderBinlogged && m != nil {
		// Only log if binary log is on and header has not been logged, and
		// there is actually headers to log.
		logEntry := &binarylog.ServerHeader{
			OnClientSide: true,
			Header:       m,
			PeerAddr:     nil,
		}
		if peer, ok := peer.FromContext(cs.Context()); ok {
			logEntry.PeerAddr = peer.Addr
		}
		cs.serverHeaderBinlogged = true
		for _, binlog := range cs.binlogs {
			binlog.Log(cs.ctx, logEntry)
		}
	}

	return m, nil
}

func (cs *clientStream) Trailer() metadata.MD {
	// On RPC failure, we never need to retry, because usage requires that
	// RecvMsg() returned a non-nil error before calling this function is valid.
	// We would have retried earlier if necessary.
	//
	// Commit the attempt anyway, just in case users are not following those
	// directions -- it will prevent races and should not meaningfully impact
	// performance.
	cs.commitAttempt()
	if cs.attempt.s == nil {
		return nil
	}
	return cs.attempt.s.Trailer()
}

func (cs *clientStream) replayBufferLocked(attempt *csAttempt) error {
	for _, f := range cs.buffer {
		if err := f(attempt); err != nil {
			return err
		}
	}
	return nil
}

func (cs *clientStream) bufferForRetryLocked(sz int, op func(a *csAttempt) error) {
	// Note: we still will buffer if retry is disabled (for transparent retries).
	if cs.committed {
		return
	}
	cs.bufferSize += sz
	if cs.bufferSize > cs.callInfo.maxRetryRPCBufferSize {
		cs.commitAttemptLocked()
		return
	}
	cs.buffer = append(cs.buffer, op)
}

func (cs *clientStream) SendMsg(m any) (err error) {
	defer func() {
		if err != nil && err != io.EOF {
			// Call finish on the client stream for errors generated by this SendMsg
			// call, as these indicate problems created by this client.  (Transport
			// errors are converted to an io.EOF error in csAttempt.sendMsg; the real
			// error will be returned from RecvMsg eventually in that case, or be
			// retried.)
			cs.finish(err)
		}
	}()
	if cs.sentLast {
		return status.Errorf(codes.Internal, "SendMsg called after CloseSend")
	}
	if !cs.desc.ClientStreams {
		cs.sentLast = true
	}

	// load hdr, payload, data
	hdr, payload, data, err := prepareMsg(m, cs.codec, cs.cp, cs.comp)
	if err != nil {
		return err
	}

	// TODO(dfawley): should we be checking len(data) instead?
	if len(payload) > *cs.callInfo.maxSendMessageSize {
		return status.Errorf(codes.ResourceExhausted, "trying to send message larger than max (%d vs. %d)", len(payload), *cs.callInfo.maxSendMessageSize)
	}
	op := func(a *csAttempt) error {
		return a.sendMsg(m, hdr, payload, data)
	}
	err = cs.withRetry(op, func() { cs.bufferForRetryLocked(len(hdr)+len(payload), op) })
	if len(cs.binlogs) != 0 && err == nil {
		cm := &binarylog.ClientMessage{
			OnClientSide: true,
			Message:      data,
		}
		for _, binlog := range cs.binlogs {
			binlog.Log(cs.ctx, cm)
		}
	}
	return err
}

func (cs *clientStream) RecvMsg(m any) error {
	if len(cs.binlogs) != 0 && !cs.serverHeaderBinlogged {
		// Call Header() to binary log header if it's not already logged.
		cs.Header()
	}
	var recvInfo *payloadInfo
	if len(cs.binlogs) != 0 {
		recvInfo = &payloadInfo{}
	}
	err := cs.withRetry(func(a *csAttempt) error {
		return a.recvMsg(m, recvInfo)
	}, cs.commitAttemptLocked)
	if len(cs.binlogs) != 0 && err == nil {
		sm := &binarylog.ServerMessage{
			OnClientSide: true,
			Message:      recvInfo.uncompressedBytes,
		}
		for _, binlog := range cs.binlogs {
			binlog.Log(cs.ctx, sm)
		}
	}
	if err != nil || !cs.desc.ServerStreams {
		// err != nil or non-server-streaming indicates end of stream.
		cs.finish(err)
	}
	return err
}

func (cs *clientStream) CloseSend() error {
	if cs.sentLast {
		// TODO: return an error and finish the stream instead, due to API misuse?
		return nil
	}
	cs.sentLast = true
	op := func(a *csAttempt) error {
		a.t.Write(a.s, nil, nil, &transport.Options{Last: true})
		// Always return nil; io.EOF is the only error that might make sense
		// instead, but there is no need to signal the client to call RecvMsg
		// as the only use left for the stream after CloseSend is to call
		// RecvMsg.  This also matches historical behavior.
		return nil
	}
	cs.withRetry(op, func() { cs.bufferForRetryLocked(0, op) })
	if len(cs.binlogs) != 0 {
		chc := &binarylog.ClientHalfClose{
			OnClientSide: true,
		}
		for _, binlog := range cs.binlogs {
			binlog.Log(cs.ctx, chc)
		}
	}
	// We never returned an error here for reasons.
	return nil
}

func (cs *clientStream) finish(err error) {
	if err == io.EOF {
		// Ending a stream with EOF indicates a success.
		err = nil
	}
	cs.mu.Lock()
	if cs.finished {
		cs.mu.Unlock()
		return
	}
	cs.finished = true
	for _, onFinish := range cs.callInfo.onFinish {
		onFinish(err)
	}
	cs.commitAttemptLocked()
	if cs.attempt != nil {
		cs.attempt.finish(err)
		// after functions all rely upon having a stream.
		if cs.attempt.s != nil {
			for _, o := range cs.opts {
				o.after(cs.callInfo, cs.attempt)
			}
		}
	}

	cs.mu.Unlock()
	// Only one of cancel or trailer needs to be logged.
	if len(cs.binlogs) != 0 {
		switch err {
		case errContextCanceled, errContextDeadline, ErrClientConnClosing:
			c := &binarylog.Cancel{
				OnClientSide: true,
			}
			for _, binlog := range cs.binlogs {
				binlog.Log(cs.ctx, c)
			}
		default:
			logEntry := &binarylog.ServerTrailer{
				OnClientSide: true,
				Trailer:      cs.Trailer(),
				Err:          err,
			}
			if peer, ok := peer.FromContext(cs.Context()); ok {
				logEntry.PeerAddr = peer.Addr
			}
			for _, binlog := range cs.binlogs {
				binlog.Log(cs.ctx, logEntry)
			}
		}
	}
	if err == nil {
		cs.retryThrottler.successfulRPC()
	}
	if channelz.IsOn() {
		if err != nil {
			cs.cc.incrCallsFailed()
		} else {
			cs.cc.incrCallsSucceeded()
		}
	}
	cs.cancel()
}

func (a *csAttempt) sendMsg(m any, hdr, payld, data []byte) error {
	cs := a.cs
	if a.trInfo != nil {
		a.mu.Lock()
		if a.trInfo.tr != nil {
			a.trInfo.tr.LazyLog(&payload{sent: true, msg: m}, true)
		}
		a.mu.Unlock()
	}
	if err := a.t.Write(a.s, hdr, payld, &transport.Options{Last: !cs.desc.ClientStreams}); err != nil {
		if !cs.desc.ClientStreams {
			// For non-client-streaming RPCs, we return nil instead of EOF on error
			// because the generated code requires it.  finish is not called; RecvMsg()
			// will call it with the stream's status independently.
			return nil
		}
		return io.EOF
	}
	for _, sh := range a.statsHandlers {
		sh.HandleRPC(a.ctx, outPayload(true, m, data, payld, time.Now()))
	}
	if channelz.IsOn() {
		a.t.IncrMsgSent()
	}
	return nil
}

func (a *csAttempt) recvMsg(m any, payInfo *payloadInfo) (err error) {
	cs := a.cs
	if len(a.statsHandlers) != 0 && payInfo == nil {
		payInfo = &payloadInfo{}
	}

	if !a.decompSet {
		// Block until we receive headers containing received message encoding.
		if ct := a.s.RecvCompress(); ct != "" && ct != encoding.Identity {
			if a.dc == nil || a.dc.Type() != ct {
				// No configured decompressor, or it does not match the incoming
				// message encoding; attempt to find a registered compressor that does.
				a.dc = nil
				a.decomp = encoding.GetCompressor(ct)
			}
		} else {
			// No compression is used; disable our decompressor.
			a.dc = nil
		}
		// Only initialize this state once per stream.
		a.decompSet = true
	}
	err = recv(a.p, cs.codec, a.s, a.dc, m, *cs.callInfo.maxReceiveMessageSize, payInfo, a.decomp)
	if err != nil {
		if err == io.EOF {
			if statusErr := a.s.Status().Err(); statusErr != nil {
				return statusErr
			}
			return io.EOF // indicates successful end of stream.
		}

		return toRPCErr(err)
	}
	if a.trInfo != nil {
		a.mu.Lock()
		if a.trInfo.tr != nil {
			a.trInfo.tr.LazyLog(&payload{sent: false, msg: m}, true)
		}
		a.mu.Unlock()
	}
	for _, sh := range a.statsHandlers {
		sh.HandleRPC(a.ctx, &stats.InPayload{
			Client:   true,
			RecvTime: time.Now(),
			Payload:  m,
			// TODO truncate large payload.
			Data:             payInfo.uncompressedBytes,
			WireLength:       payInfo.compressedLength + headerLen,
			CompressedLength: payInfo.compressedLength,
			Length:           len(payInfo.uncompressedBytes),
		})
	}
	if channelz.IsOn() {
		a.t.IncrMsgRecv()
	}
	if cs.desc.ServerStreams {
		// Subsequent messages should be received by subsequent RecvMsg calls.
		return nil
	}
	// Special handling for non-server-stream rpcs.
	// This recv expects EOF or errors, so we don't collect inPayload.
	err = recv(a.p, cs.codec, a.s, a.dc, m, *cs.callInfo.maxReceiveMessageSize, nil, a.decomp)
	if err == nil {
		return toRPCErr(errors.New("grpc: client streaming protocol violation: get <nil>, want <EOF>"))
	}
	if err == io.EOF {
		return a.s.Status().Err() // non-server streaming Recv returns nil on success
	}
	return toRPCErr(err)
}

func (a *csAttempt) finish(err error) {
	a.mu.Lock()
	if a.finished {
		a.mu.Unlock()
		return
	}
	a.finished = true
	if err == io.EOF {
		// Ending a stream with EOF indicates a success.
		err = nil
	}
	var tr metadata.MD
	if a.s != nil {
		a.t.CloseStream(a.s, err)
		tr = a.s.Trailer()
	}

	if a.pickResult.Done != nil {
		br := false
		if a.s != nil {
			br = a.s.BytesReceived()
		}
		a.pickResult.Done(balancer.DoneInfo{
			Err:           err,
			Trailer:       tr,
			BytesSent:     a.s != nil,
			BytesReceived: br,
			ServerLoad:    balancerload.Parse(tr),
		})
	}
	for _, sh := range a.statsHandlers {
		end := &stats.End{
			Client:    true,
			BeginTime: a.beginTime,
			EndTime:   time.Now(),
			Trailer:   tr,
			Error:     err,
		}
		sh.HandleRPC(a.ctx, end)
	}
	if a.trInfo != nil && a.trInfo.tr != nil {
		if err == nil {
			a.trInfo.tr.LazyPrintf("RPC: [OK]")
		} else {
			a.trInfo.tr.LazyPrintf("RPC: [%v]", err)
			a.trInfo.tr.SetError()
		}
		a.trInfo.tr.Finish()
		a.trInfo.tr = nil
	}
	a.mu.Unlock()
}

// newClientStream creates a ClientStream with the specified transport, on the
// given addrConn.
//
// It's expected that the given transport is either the same one in addrConn, or
// is already closed. To avoid race, transport is specified separately, instead
// of using ac.transpot.
//
// Main difference between this and ClientConn.NewStream:
// - no retry
// - no service config (or wait for service config)
// - no tracing or stats
func newNonRetryClientStream(ctx context.Context, desc *StreamDesc, method string, t transport.ClientTransport, ac *addrConn, opts ...CallOption) (_ ClientStream, err error) {
	if t == nil {
		// TODO: return RPC error here?
		return nil, errors.New("transport provided is nil")
	}
	// defaultCallInfo contains unnecessary info(i.e. failfast, maxRetryRPCBufferSize), so we just initialize an empty struct.
	c := &callInfo{}

	// Possible context leak:
	// The cancel function for the child context we create will only be called
	// when RecvMsg returns a non-nil error, if the ClientConn is closed, or if
	// an error is generated by SendMsg.
	// https://github.com/grpc/grpc-go/issues/1818.
	ctx, cancel := context.WithCancel(ctx)
	defer func() {
		if err != nil {
			cancel()
		}
	}()

	for _, o := range opts {
		if err := o.before(c); err != nil {
			return nil, toRPCErr(err)
		}
	}
	c.maxReceiveMessageSize = getMaxSize(nil, c.maxReceiveMessageSize, defaultClientMaxReceiveMessageSize)
	c.maxSendMessageSize = getMaxSize(nil, c.maxSendMessageSize, defaultServerMaxSendMessageSize)
	if err := setCallInfoCodec(c); err != nil {
		return nil, err
	}

	callHdr := &transport.CallHdr{
		Host:           ac.cc.authority,
		Method:         method,
		ContentSubtype: c.contentSubtype,
	}

	// Set our outgoing compression according to the UseCompressor CallOption, if
	// set.  In that case, also find the compressor from the encoding package.
	// Otherwise, use the compressor configured by the WithCompressor DialOption,
	// if set.
	var cp Compressor
	var comp encoding.Compressor
	if ct := c.compressorType; ct != "" {
		callHdr.SendCompress = ct
		if ct != encoding.Identity {
			comp = encoding.GetCompressor(ct)
			if comp == nil {
				return nil, status.Errorf(codes.Internal, "grpc: Compressor is not installed for requested grpc-encoding %q", ct)
			}
		}
	} else if ac.cc.dopts.cp != nil {
		callHdr.SendCompress = ac.cc.dopts.cp.Type()
		cp = ac.cc.dopts.cp
	}
	if c.creds != nil {
		callHdr.Creds = c.creds
	}

	// Use a special addrConnStream to avoid retry.
	as := &addrConnStream{
		callHdr:  callHdr,
		ac:       ac,
		ctx:      ctx,
		cancel:   cancel,
		opts:     opts,
		callInfo: c,
		desc:     desc,
		codec:    c.codec,
		cp:       cp,
		comp:     comp,
		t:        t,
	}

	s, err := as.t.NewStream(as.ctx, as.callHdr)
	if err != nil {
		err = toRPCErr(err)
		return nil, err
	}
	as.s = s
	as.p = &parser{r: s, recvBufferPool: ac.dopts.recvBufferPool}
	ac.incrCallsStarted()
	if desc != unaryStreamDesc {
		// Listen on stream context to cleanup when the stream context is
		// canceled.  Also listen for the addrConn's context in case the
		// addrConn is closed or reconnects to a different address.  In all
		// other cases, an error should already be injected into the recv
		// buffer by the transport, which the client will eventually receive,
		// and then we will cancel the stream's context in
		// addrConnStream.finish.
		go func() {
			ac.mu.Lock()
			acCtx := ac.ctx
			ac.mu.Unlock()
			select {
			case <-acCtx.Done():
				as.finish(status.Error(codes.Canceled, "grpc: the SubConn is closing"))
			case <-ctx.Done():
				as.finish(toRPCErr(ctx.Err()))
			}
		}()
	}
	return as, nil
}

type addrConnStream struct {
	s         *transport.Stream
	ac        *addrConn
	callHdr   *transport.CallHdr
	cancel    context.CancelFunc
	opts      []CallOption
	callInfo  *callInfo
	t         transport.ClientTransport
	ctx       context.Context
	sentLast  bool
	desc      *StreamDesc
	codec     baseCodec
	cp        Compressor
	comp      encoding.Compressor
	decompSet bool
	dc        Decompressor
	decomp    encoding.Compressor
	p         *parser
	mu        sync.Mutex
	finished  bool
}

func (as *addrConnStream) Header() (metadata.MD, error) {
	m, err := as.s.Header()
	if err != nil {
		as.finish(toRPCErr(err))
	}
	return m, err
}

func (as *addrConnStream) Trailer() metadata.MD {
	return as.s.Trailer()
}

func (as *addrConnStream) CloseSend() error {
	if as.sentLast {
		// TODO: return an error and finish the stream instead, due to API misuse?
		return nil
	}
	as.sentLast = true

	as.t.Write(as.s, nil, nil, &transport.Options{Last: true})
	// Always return nil; io.EOF is the only error that might make sense
	// instead, but there is no need to signal the client to call RecvMsg
	// as the only use left for the stream after CloseSend is to call
	// RecvMsg.  This also matches historical behavior.
	return nil
}

func (as *addrConnStream) Context() context.Context {
	return as.s.Context()
}

func (as *addrConnStream) SendMsg(m any) (err error) {
	defer func() {
		if err != nil && err != io.EOF {
			// Call finish on the client stream for errors generated by this SendMsg
			// call, as these indicate problems created by this client.  (Transport
			// errors are converted to an io.EOF error in csAttempt.sendMsg; the real
			// error will be returned from RecvMsg eventually in that case, or be
			// retried.)
			as.finish(err)
		}
	}()
	if as.sentLast {
		return status.Errorf(codes.Internal, "SendMsg called after CloseSend")
	}
	if !as.desc.ClientStreams {
		as.sentLast = true
	}

	// load hdr, payload, data
	hdr, payld, _, err := prepareMsg(m, as.codec, as.cp, as.comp)
	if err != nil {
		return err
	}

	// TODO(dfawley): should we be checking len(data) instead?
	if len(payld) > *as.callInfo.maxSendMessageSize {
		return status.Errorf(codes.ResourceExhausted, "trying to send message larger than max (%d vs. %d)", len(payld), *as.callInfo.maxSendMessageSize)
	}

	if err := as.t.Write(as.s, hdr, payld, &transport.Options{Last: !as.desc.ClientStreams}); err != nil {
		if !as.desc.ClientStreams {
			// For non-client-streaming RPCs, we return nil instead of EOF on error
			// because the generated code requires it.  finish is not called; RecvMsg()
			// will call it with the stream's status independently.
			return nil
		}
		return io.EOF
	}

	if channelz.IsOn() {
		as.t.IncrMsgSent()
	}
	return nil
}

func (as *addrConnStream) RecvMsg(m any) (err error) {
	defer func() {
		if err != nil || !as.desc.ServerStreams {
			// err != nil or non-server-streaming indicates end of stream.
			as.finish(err)
		}
	}()

	if !as.decompSet {
		// Block until we receive headers containing received message encoding.
		if ct := as.s.RecvCompress(); ct != "" && ct != encoding.Identity {
			if as.dc == nil || as.dc.Type() != ct {
				// No configured decompressor, or it does not match the incoming
				// message encoding; attempt to find a registered compressor that does.
				as.dc = nil
				as.decomp = encoding.GetCompressor(ct)
			}
		} else {
			// No compression is used; disable our decompressor.
			as.dc = nil
		}
		// Only initialize this state once per stream.
		as.decompSet = true
	}
	err = recv(as.p, as.codec, as.s, as.dc, m, *as.callInfo.maxReceiveMessageSize, nil, as.decomp)
	if err != nil {
		if err == io.EOF {
			if statusErr := as.s.Status().Err(); statusErr != nil {
				return statusErr
			}
			return io.EOF // indicates successful end of stream.
		}
		return toRPCErr(err)
	}

	if channelz.IsOn() {
		as.t.IncrMsgRecv()
	}
	if as.desc.ServerStreams {
		// Subsequent messages should be received by subsequent RecvMsg calls.
		return nil
	}

	// Special handling for non-server-stream rpcs.
	// This recv expects EOF or errors, so we don't collect inPayload.
	err = recv(as.p, as.codec, as.s, as.dc, m, *as.callInfo.maxReceiveMessageSize, nil, as.decomp)
	if err == nil {
		return toRPCErr(errors.New("grpc: client streaming protocol violation: get <nil>, want <EOF>"))
	}
	if err == io.EOF {
		return as.s.Status().Err() // non-server streaming Recv returns nil on success
	}
	return toRPCErr(err)
}

func (as *addrConnStream) finish(err error) {
	as.mu.Lock()
	if as.finished {
		as.mu.Unlock()
		return
	}
	as.finished = true
	if err == io.EOF {
		// Ending a stream with EOF indicates a success.
		err = nil
	}
	if as.s != nil {
		as.t.CloseStream(as.s, err)
	}

	if err != nil {
		as.ac.incrCallsFailed()
	} else {
		as.ac.incrCallsSucceeded()
	}
	as.cancel()
	as.mu.Unlock()
}

// ServerStream defines the server-side behavior of a streaming RPC.
//
// Errors returned from ServerStream methods are compatible with the status
// package.  However, the status code will often not match the RPC status as
// seen by the client application, and therefore, should not be relied upon for
// this purpose.
type ServerStream interface {
	// SetHeader sets the header metadata. It may be called multiple times.
	// When call multiple times, all the provided metadata will be merged.
	// All the metadata will be sent out when one of the following happens:
	//  - ServerStream.SendHeader() is called;
	//  - The first response is sent out;
	//  - An RPC status is sent out (error or success).
	SetHeader(metadata.MD) error
	// SendHeader sends the header metadata.
	// The provided md and headers set by SetHeader() will be sent.
	// It fails if called multiple times.
	SendHeader(metadata.MD) error
	// SetTrailer sets the trailer metadata which will be sent with the RPC status.
	// When called more than once, all the provided metadata will be merged.
	SetTrailer(metadata.MD)
	// Context returns the context for this stream.
	Context() context.Context
	// SendMsg sends a message. On error, SendMsg aborts the stream and the
	// error is returned directly.
	//
	// SendMsg blocks until:
	//   - There is sufficient flow control to schedule m with the transport, or
	//   - The stream is done, or
	//   - The stream breaks.
	//
	// SendMsg does not wait until the message is received by the client. An
	// untimely stream closure may result in lost messages.
	//
	// It is safe to have a goroutine calling SendMsg and another goroutine
	// calling RecvMsg on the same stream at the same time, but it is not safe
	// to call SendMsg on the same stream in different goroutines.
	//
	// It is not safe to modify the message after calling SendMsg. Tracing
	// libraries and stats handlers may use the message lazily.
	SendMsg(m any) error
	// RecvMsg blocks until it receives a message into m or the stream is
	// done. It returns io.EOF when the client has performed a CloseSend. On
	// any non-EOF error, the stream is aborted and the error contains the
	// RPC status.
	//
	// It is safe to have a goroutine calling SendMsg and another goroutine
	// calling RecvMsg on the same stream at the same time, but it is not
	// safe to call RecvMsg on the same stream in different goroutines.
	RecvMsg(m any) error
}

// serverStream implements a server side Stream.
type serverStream struct {
	ctx   context.Context
	t     transport.ServerTransport
	s     *transport.Stream
	p     *parser
	codec baseCodec

	cp     Compressor
	dc     Decompressor
	comp   encoding.Compressor
	decomp encoding.Compressor

	sendCompressorName string

	maxReceiveMessageSize int
	maxSendMessageSize    int
	trInfo                *traceInfo

	statsHandler []stats.Handler

	binlogs []binarylog.MethodLogger
	// serverHeaderBinlogged indicates whether server header has been logged. It
	// will happen when one of the following two happens: stream.SendHeader(),
	// stream.Send().
	//
	// It's only checked in send and sendHeader, doesn't need to be
	// synchronized.
	serverHeaderBinlogged bool

	mu sync.Mutex // protects trInfo.tr after the service handler runs.
}

func (ss *serverStream) Context() context.Context {
	return ss.ctx
}

func (ss *serverStream) SetHeader(md metadata.MD) error {
	if md.Len() == 0 {
		return nil
	}
	err := imetadata.Validate(md)
	if err != nil {
		return status.Error(codes.Internal, err.Error())
	}
	return ss.s.SetHeader(md)
}

func (ss *serverStream) SendHeader(md metadata.MD) error {
	err := imetadata.Validate(md)
	if err != nil {
		return status.Error(codes.Internal, err.Error())
	}

	err = ss.t.WriteHeader(ss.s, md)
	if len(ss.binlogs) != 0 && !ss.serverHeaderBinlogged {
		h, _ := ss.s.Header()
		sh := &binarylog.ServerHeader{
			Header: h,
		}
		ss.serverHeaderBinlogged = true
		for _, binlog := range ss.binlogs {
			binlog.Log(ss.ctx, sh)
		}
	}
	return err
}

func (ss *serverStream) SetTrailer(md metadata.MD) {
	if md.Len() == 0 {
		return
	}
	if err := imetadata.Validate(md); err != nil {
		logger.Errorf("stream: failed to validate md when setting trailer, err: %v", err)
	}
	ss.s.SetTrailer(md)
}

func (ss *serverStream) SendMsg(m any) (err error) {
	defer func() {
		if ss.trInfo != nil {
			ss.mu.Lock()
			if ss.trInfo.tr != nil {
				if err == nil {
					ss.trInfo.tr.LazyLog(&payload{sent: true, msg: m}, true)
				} else {
					ss.trInfo.tr.LazyLog(&fmtStringer{"%v", []any{err}}, true)
					ss.trInfo.tr.SetError()
				}
			}
			ss.mu.Unlock()
		}
		if err != nil && err != io.EOF {
			st, _ := status.FromError(toRPCErr(err))
			ss.t.WriteStatus(ss.s, st)
			// Non-user specified status was sent out. This should be an error
			// case (as a server side Cancel maybe).
			//
			// This is not handled specifically now. User will return a final
			// status from the service handler, we will log that error instead.
			// This behavior is similar to an interceptor.
		}
		if channelz.IsOn() && err == nil {
			ss.t.IncrMsgSent()
		}
	}()

	// Server handler could have set new compressor by calling SetSendCompressor.
	// In case it is set, we need to use it for compressing outbound message.
	if sendCompressorsName := ss.s.SendCompress(); sendCompressorsName != ss.sendCompressorName {
		ss.comp = encoding.GetCompressor(sendCompressorsName)
		ss.sendCompressorName = sendCompressorsName
	}

	// load hdr, payload, data
	hdr, payload, data, err := prepareMsg(m, ss.codec, ss.cp, ss.comp)
	if err != nil {
		return err
	}

	// TODO(dfawley): should we be checking len(data) instead?
	if len(payload) > ss.maxSendMessageSize {
		return status.Errorf(codes.ResourceExhausted, "trying to send message larger than max (%d vs. %d)", len(payload), ss.maxSendMessageSize)
	}
	if err := ss.t.Write(ss.s, hdr, payload, &transport.Options{Last: false}); err != nil {
		return toRPCErr(err)
	}
	if len(ss.binlogs) != 0 {
		if !ss.serverHeaderBinlogged {
			h, _ := ss.s.Header()
			sh := &binarylog.ServerHeader{
				Header: h,
			}
			ss.serverHeaderBinlogged = true
			for _, binlog := range ss.binlogs {
				binlog.Log(ss.ctx, sh)
			}
		}
		sm := &binarylog.ServerMessage{
			Message: data,
		}
		for _, binlog := range ss.binlogs {
			binlog.Log(ss.ctx, sm)
		}
	}
	if len(ss.statsHandler) != 0 {
		for _, sh := range ss.statsHandler {
			sh.HandleRPC(ss.s.Context(), outPayload(false, m, data, payload, time.Now()))
		}
	}
	return nil
}

func (ss *serverStream) RecvMsg(m any) (err error) {
	defer func() {
		if ss.trInfo != nil {
			ss.mu.Lock()
			if ss.trInfo.tr != nil {
				if err == nil {
					ss.trInfo.tr.LazyLog(&payload{sent: false, msg: m}, true)
				} else if err != io.EOF {
					ss.trInfo.tr.LazyLog(&fmtStringer{"%v", []any{err}}, true)
					ss.trInfo.tr.SetError()
				}
			}
			ss.mu.Unlock()
		}
		if err != nil && err != io.EOF {
			st, _ := status.FromError(toRPCErr(err))
			ss.t.WriteStatus(ss.s, st)
			// Non-user specified status was sent out. This should be an error
			// case (as a server side Cancel maybe).
			//
			// This is not handled specifically now. User will return a final
			// status from the service handler, we will log that error instead.
			// This behavior is similar to an interceptor.
		}
		if channelz.IsOn() && err == nil {
			ss.t.IncrMsgRecv()
		}
	}()
	var payInfo *payloadInfo
	if len(ss.statsHandler) != 0 || len(ss.binlogs) != 0 {
		payInfo = &payloadInfo{}
	}
	if err := recv(ss.p, ss.codec, ss.s, ss.dc, m, ss.maxReceiveMessageSize, payInfo, ss.decomp); err != nil {
		if err == io.EOF {
			if len(ss.binlogs) != 0 {
				chc := &binarylog.ClientHalfClose{}
				for _, binlog := range ss.binlogs {
					binlog.Log(ss.ctx, chc)
				}
			}
			return err
		}
		if err == io.ErrUnexpectedEOF {
			err = status.Errorf(codes.Internal, io.ErrUnexpectedEOF.Error())
		}
		return toRPCErr(err)
	}
	if len(ss.statsHandler) != 0 {
		for _, sh := range ss.statsHandler {
			sh.HandleRPC(ss.s.Context(), &stats.InPayload{
				RecvTime: time.Now(),
				Payload:  m,
				// TODO truncate large payload.
				Data:             payInfo.uncompressedBytes,
				Length:           len(payInfo.uncompressedBytes),
				WireLength:       payInfo.compressedLength + headerLen,
				CompressedLength: payInfo.compressedLength,
			})
		}
	}
	if len(ss.binlogs) != 0 {
		cm := &binarylog.ClientMessage{
			Message: payInfo.uncompressedBytes,
		}
		for _, binlog := range ss.binlogs {
			binlog.Log(ss.ctx, cm)
		}
	}
	return nil
}

// MethodFromServerStream returns the method string for the input stream.
// The returned string is in the format of "/service/method".
func MethodFromServerStream(stream ServerStream) (string, bool) {
	return Method(stream.Context())
}

// prepareMsg returns the hdr, payload and data
// using the compressors passed or using the
// passed preparedmsg
func prepareMsg(m any, codec baseCodec, cp Compressor, comp encoding.Compressor) (hdr, payload, data []byte, err error) {
	if preparedMsg, ok := m.(*PreparedMsg); ok {
		return preparedMsg.hdr, preparedMsg.payload, preparedMsg.encodedData, nil
	}
	// The input interface is not a prepared msg.
	// Marshal and Compress the data at this point
	data, err = encode(codec, m)
	if err != nil {
		return nil, nil, nil, err
	}
	compData, err := compress(data, cp, comp)
	if err != nil {
		return nil, nil, nil, err
	}
	hdr, payload = msgHeader(data, compData)
	return hdr, payload, data, nil
}
