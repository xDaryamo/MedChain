/*
 *
 * Copyright 2018 gRPC authors.
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

// Package dns implements a dns resolver to be installed as the default resolver
// in grpc.
package dns

import (
	"context"
	"encoding/json"
<<<<<<< HEAD
	"errors"
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
	"errors"
=======
<<<<<<< HEAD
=======
	"errors"
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
	"errors"
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	"fmt"
	"net"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	grpclbstate "google.golang.org/grpc/balancer/grpclb/state"
	"google.golang.org/grpc/grpclog"
	"google.golang.org/grpc/internal/backoff"
	"google.golang.org/grpc/internal/envconfig"
	"google.golang.org/grpc/internal/grpcrand"
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
	"google.golang.org/grpc/internal/resolver/dns/internal"
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
	"google.golang.org/grpc/internal/resolver/dns/internal"
=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	"google.golang.org/grpc/resolver"
	"google.golang.org/grpc/serviceconfig"
)

// EnableSRVLookups controls whether the DNS resolver attempts to fetch gRPCLB
// addresses from SRV records.  Must not be changed after init time.
var EnableSRVLookups = false

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
// ResolvingTimeout specifies the maximum duration for a DNS resolution request.
// If the timeout expires before a response is received, the request will be canceled.
//
// It is recommended to set this value at application startup. Avoid modifying this variable
// after initialization as it's not thread-safe for concurrent modification.
var ResolvingTimeout = 30 * time.Second

var logger = grpclog.Component("dns")

func init() {
	resolver.Register(NewBuilder())
	internal.TimeAfterFunc = time.After
	internal.NewNetResolver = newNetResolver
	internal.AddressDialer = addressDialer
<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
var logger = grpclog.Component("dns")

// Globals to stub out in tests. TODO: Perhaps these two can be combined into a
// single variable for testing the resolver?
var (
	newTimer           = time.NewTimer
	newTimerDNSResRate = time.NewTimer
)

func init() {
	resolver.Register(NewBuilder())
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

const (
	defaultPort       = "443"
	defaultDNSSvrPort = "53"
	golang            = "GO"
	// txtPrefix is the prefix string to be prepended to the host name for txt
	// record lookup.
	txtPrefix = "_grpc_config."
	// In DNS, service config is encoded in a TXT record via the mechanism
	// described in RFC-1464 using the attribute name grpc_config.
	txtAttribute = "grpc_config="
)

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
var (
	errMissingAddr = errors.New("dns resolver: missing address")

	// Addresses ending with a colon that is supposed to be the separator
	// between host and port is not allowed.  E.g. "::" is a valid address as
	// it is an IPv6 address (host only) and "[::]:" is invalid as it ends with
	// a colon as the host and port separator
	errEndsWithColon = errors.New("dns resolver: missing port after port-separator colon")
)

var (
	defaultResolver netResolver = net.DefaultResolver
	// To prevent excessive re-resolution, we enforce a rate limit on DNS
	// resolution requests.
	minDNSResRate = 30 * time.Second
)

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
var addressDialer = func(address string) func(context.Context, string, string) (net.Conn, error) {
	return func(ctx context.Context, network, _ string) (net.Conn, error) {
		var dialer net.Dialer
		return dialer.DialContext(ctx, network, address)
	}
}

<<<<<<< HEAD
var newNetResolver = func(authority string) (netResolver, error) {
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
var newNetResolver = func(authority string) (netResolver, error) {
=======
<<<<<<< HEAD
>>>>>>> master
var newNetResolver = func(authority string) (internal.NetResolver, error) {
	if authority == "" {
		return net.DefaultResolver, nil
	}

<<<<<<< HEAD
=======
=======
var newNetResolver = func(authority string) (netResolver, error) {
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
var newNetResolver = func(authority string) (netResolver, error) {
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	host, port, err := parseTarget(authority, defaultDNSSvrPort)
	if err != nil {
		return nil, err
	}

	authorityWithPort := net.JoinHostPort(host, port)

	return &net.Resolver{
		PreferGo: true,
<<<<<<< HEAD
		Dial:     addressDialer(authorityWithPort),
=======
<<<<<<< HEAD
<<<<<<< HEAD
		Dial:     internal.AddressDialer(authorityWithPort),
=======
<<<<<<< HEAD
		Dial:     addressDialer(authorityWithPort),
=======
<<<<<<< HEAD
		Dial:     internal.AddressDialer(authorityWithPort),
=======
		Dial:     addressDialer(authorityWithPort),
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
		Dial:     addressDialer(authorityWithPort),
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	}, nil
}

// NewBuilder creates a dnsBuilder which is used to factory DNS resolvers.
func NewBuilder() resolver.Builder {
	return &dnsBuilder{}
}

type dnsBuilder struct{}

// Build creates and starts a DNS resolver that watches the name resolution of
// the target.
func (b *dnsBuilder) Build(target resolver.Target, cc resolver.ClientConn, opts resolver.BuildOptions) (resolver.Resolver, error) {
	host, port, err := parseTarget(target.Endpoint(), defaultPort)
	if err != nil {
		return nil, err
	}

	// IP address.
	if ipAddr, ok := formatIP(host); ok {
		addr := []resolver.Address{{Addr: ipAddr + ":" + port}}
		cc.UpdateState(resolver.State{Addresses: addr})
		return deadResolver{}, nil
	}

	// DNS address (non-IP).
	ctx, cancel := context.WithCancel(context.Background())
	d := &dnsResolver{
		host:                 host,
		port:                 port,
		ctx:                  ctx,
		cancel:               cancel,
		cc:                   cc,
		rn:                   make(chan struct{}, 1),
		disableServiceConfig: opts.DisableServiceConfig,
	}

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
	d.resolver, err = internal.NewNetResolver(target.URL.Host)
	if err != nil {
		return nil, err
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
	d.resolver, err = internal.NewNetResolver(target.URL.Host)
	if err != nil {
		return nil, err
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	if target.URL.Host == "" {
		d.resolver = defaultResolver
	} else {
		d.resolver, err = newNetResolver(target.URL.Host)
		if err != nil {
			return nil, err
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

	d.wg.Add(1)
	go d.watcher()
	return d, nil
}

// Scheme returns the naming scheme of this resolver builder, which is "dns".
func (b *dnsBuilder) Scheme() string {
	return "dns"
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
type netResolver interface {
	LookupHost(ctx context.Context, host string) (addrs []string, err error)
	LookupSRV(ctx context.Context, service, proto, name string) (cname string, addrs []*net.SRV, err error)
	LookupTXT(ctx context.Context, name string) (txts []string, err error)
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
// deadResolver is a resolver that does nothing.
type deadResolver struct{}

func (deadResolver) ResolveNow(resolver.ResolveNowOptions) {}

func (deadResolver) Close() {}

// dnsResolver watches for the name resolution update for a non-IP target.
type dnsResolver struct {
	host     string
	port     string
<<<<<<< HEAD
	resolver netResolver
=======
<<<<<<< HEAD
<<<<<<< HEAD
	resolver internal.NetResolver
=======
<<<<<<< HEAD
	resolver netResolver
=======
<<<<<<< HEAD
	resolver internal.NetResolver
=======
	resolver netResolver
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
	resolver netResolver
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	ctx      context.Context
	cancel   context.CancelFunc
	cc       resolver.ClientConn
	// rn channel is used by ResolveNow() to force an immediate resolution of the
	// target.
	rn chan struct{}
	// wg is used to enforce Close() to return after the watcher() goroutine has
	// finished. Otherwise, data race will be possible. [Race Example] in
	// dns_resolver_test we replace the real lookup functions with mocked ones to
	// facilitate testing. If Close() doesn't wait for watcher() goroutine
	// finishes, race detector sometimes will warns lookup (READ the lookup
	// function pointers) inside watcher() goroutine has data race with
	// replaceNetFunc (WRITE the lookup function pointers).
	wg                   sync.WaitGroup
	disableServiceConfig bool
}

// ResolveNow invoke an immediate resolution of the target that this
// dnsResolver watches.
func (d *dnsResolver) ResolveNow(resolver.ResolveNowOptions) {
	select {
	case d.rn <- struct{}{}:
	default:
	}
}

// Close closes the dnsResolver.
func (d *dnsResolver) Close() {
	d.cancel()
	d.wg.Wait()
}

func (d *dnsResolver) watcher() {
	defer d.wg.Done()
	backoffIndex := 1
	for {
		state, err := d.lookup()
		if err != nil {
			// Report error to the underlying grpc.ClientConn.
			d.cc.ReportError(err)
		} else {
			err = d.cc.UpdateState(*state)
		}

<<<<<<< HEAD
		var timer *time.Timer
=======
<<<<<<< HEAD
<<<<<<< HEAD
		var waitTime time.Duration
=======
<<<<<<< HEAD
		var timer *time.Timer
=======
<<<<<<< HEAD
		var waitTime time.Duration
=======
		var timer *time.Timer
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
		var timer *time.Timer
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
		if err == nil {
			// Success resolving, wait for the next ResolveNow. However, also wait 30
			// seconds at the very least to prevent constantly re-resolving.
			backoffIndex = 1
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
			waitTime = internal.MinResolutionRate
			select {
			case <-d.ctx.Done():
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
			waitTime = internal.MinResolutionRate
			select {
			case <-d.ctx.Done():
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
			timer = newTimerDNSResRate(minDNSResRate)
			select {
			case <-d.ctx.Done():
				timer.Stop()
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
				return
			case <-d.rn:
			}
		} else {
			// Poll on an error found in DNS Resolver or an error received from
			// ClientConn.
<<<<<<< HEAD
			timer = newTimer(backoff.DefaultExponential.Backoff(backoffIndex))
=======
<<<<<<< HEAD
<<<<<<< HEAD
			waitTime = backoff.DefaultExponential.Backoff(backoffIndex)
=======
<<<<<<< HEAD
			timer = newTimer(backoff.DefaultExponential.Backoff(backoffIndex))
=======
<<<<<<< HEAD
			waitTime = backoff.DefaultExponential.Backoff(backoffIndex)
=======
			timer = newTimer(backoff.DefaultExponential.Backoff(backoffIndex))
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
			timer = newTimer(backoff.DefaultExponential.Backoff(backoffIndex))
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
			backoffIndex++
		}
		select {
		case <-d.ctx.Done():
<<<<<<< HEAD
			timer.Stop()
			return
		case <-timer.C:
=======
<<<<<<< HEAD
<<<<<<< HEAD
			return
		case <-internal.TimeAfterFunc(waitTime):
=======
<<<<<<< HEAD
			timer.Stop()
			return
		case <-timer.C:
=======
<<<<<<< HEAD
			return
		case <-internal.TimeAfterFunc(waitTime):
=======
			timer.Stop()
			return
		case <-timer.C:
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
			timer.Stop()
			return
		case <-timer.C:
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
		}
	}
}

<<<<<<< HEAD
func (d *dnsResolver) lookupSRV() ([]resolver.Address, error) {
=======
<<<<<<< HEAD
<<<<<<< HEAD
func (d *dnsResolver) lookupSRV(ctx context.Context) ([]resolver.Address, error) {
=======
<<<<<<< HEAD
func (d *dnsResolver) lookupSRV() ([]resolver.Address, error) {
=======
<<<<<<< HEAD
func (d *dnsResolver) lookupSRV(ctx context.Context) ([]resolver.Address, error) {
=======
func (d *dnsResolver) lookupSRV() ([]resolver.Address, error) {
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
func (d *dnsResolver) lookupSRV() ([]resolver.Address, error) {
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	if !EnableSRVLookups {
		return nil, nil
	}
	var newAddrs []resolver.Address
<<<<<<< HEAD
	_, srvs, err := d.resolver.LookupSRV(d.ctx, "grpclb", "tcp", d.host)
=======
<<<<<<< HEAD
<<<<<<< HEAD
	_, srvs, err := d.resolver.LookupSRV(ctx, "grpclb", "tcp", d.host)
=======
<<<<<<< HEAD
	_, srvs, err := d.resolver.LookupSRV(d.ctx, "grpclb", "tcp", d.host)
=======
<<<<<<< HEAD
	_, srvs, err := d.resolver.LookupSRV(ctx, "grpclb", "tcp", d.host)
=======
	_, srvs, err := d.resolver.LookupSRV(d.ctx, "grpclb", "tcp", d.host)
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
	_, srvs, err := d.resolver.LookupSRV(d.ctx, "grpclb", "tcp", d.host)
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	if err != nil {
		err = handleDNSError(err, "SRV") // may become nil
		return nil, err
	}
	for _, s := range srvs {
<<<<<<< HEAD
		lbAddrs, err := d.resolver.LookupHost(d.ctx, s.Target)
=======
<<<<<<< HEAD
<<<<<<< HEAD
		lbAddrs, err := d.resolver.LookupHost(ctx, s.Target)
=======
<<<<<<< HEAD
		lbAddrs, err := d.resolver.LookupHost(d.ctx, s.Target)
=======
<<<<<<< HEAD
		lbAddrs, err := d.resolver.LookupHost(ctx, s.Target)
=======
		lbAddrs, err := d.resolver.LookupHost(d.ctx, s.Target)
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
		lbAddrs, err := d.resolver.LookupHost(d.ctx, s.Target)
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
		if err != nil {
			err = handleDNSError(err, "A") // may become nil
			if err == nil {
				// If there are other SRV records, look them up and ignore this
				// one that does not exist.
				continue
			}
			return nil, err
		}
		for _, a := range lbAddrs {
			ip, ok := formatIP(a)
			if !ok {
				return nil, fmt.Errorf("dns: error parsing A record IP address %v", a)
			}
			addr := ip + ":" + strconv.Itoa(int(s.Port))
			newAddrs = append(newAddrs, resolver.Address{Addr: addr, ServerName: s.Target})
		}
	}
	return newAddrs, nil
}

func handleDNSError(err error, lookupType string) error {
	dnsErr, ok := err.(*net.DNSError)
	if ok && !dnsErr.IsTimeout && !dnsErr.IsTemporary {
		// Timeouts and temporary errors should be communicated to gRPC to
		// attempt another DNS query (with backoff).  Other errors should be
		// suppressed (they may represent the absence of a TXT record).
		return nil
	}
	if err != nil {
		err = fmt.Errorf("dns: %v record lookup error: %v", lookupType, err)
		logger.Info(err)
	}
	return err
}

<<<<<<< HEAD
func (d *dnsResolver) lookupTXT() *serviceconfig.ParseResult {
	ss, err := d.resolver.LookupTXT(d.ctx, txtPrefix+d.host)
=======
<<<<<<< HEAD
<<<<<<< HEAD
func (d *dnsResolver) lookupTXT(ctx context.Context) *serviceconfig.ParseResult {
	ss, err := d.resolver.LookupTXT(ctx, txtPrefix+d.host)
=======
<<<<<<< HEAD
func (d *dnsResolver) lookupTXT() *serviceconfig.ParseResult {
	ss, err := d.resolver.LookupTXT(d.ctx, txtPrefix+d.host)
=======
<<<<<<< HEAD
func (d *dnsResolver) lookupTXT(ctx context.Context) *serviceconfig.ParseResult {
	ss, err := d.resolver.LookupTXT(ctx, txtPrefix+d.host)
=======
func (d *dnsResolver) lookupTXT() *serviceconfig.ParseResult {
	ss, err := d.resolver.LookupTXT(d.ctx, txtPrefix+d.host)
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
func (d *dnsResolver) lookupTXT() *serviceconfig.ParseResult {
	ss, err := d.resolver.LookupTXT(d.ctx, txtPrefix+d.host)
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	if err != nil {
		if envconfig.TXTErrIgnore {
			return nil
		}
		if err = handleDNSError(err, "TXT"); err != nil {
			return &serviceconfig.ParseResult{Err: err}
		}
		return nil
	}
	var res string
	for _, s := range ss {
		res += s
	}

	// TXT record must have "grpc_config=" attribute in order to be used as
	// service config.
	if !strings.HasPrefix(res, txtAttribute) {
		logger.Warningf("dns: TXT record %v missing %v attribute", res, txtAttribute)
		// This is not an error; it is the equivalent of not having a service
		// config.
		return nil
	}
	sc := canaryingSC(strings.TrimPrefix(res, txtAttribute))
	return d.cc.ParseServiceConfig(sc)
}

<<<<<<< HEAD
func (d *dnsResolver) lookupHost() ([]resolver.Address, error) {
	addrs, err := d.resolver.LookupHost(d.ctx, d.host)
=======
<<<<<<< HEAD
<<<<<<< HEAD
func (d *dnsResolver) lookupHost(ctx context.Context) ([]resolver.Address, error) {
	addrs, err := d.resolver.LookupHost(ctx, d.host)
=======
<<<<<<< HEAD
func (d *dnsResolver) lookupHost() ([]resolver.Address, error) {
	addrs, err := d.resolver.LookupHost(d.ctx, d.host)
=======
<<<<<<< HEAD
func (d *dnsResolver) lookupHost(ctx context.Context) ([]resolver.Address, error) {
	addrs, err := d.resolver.LookupHost(ctx, d.host)
=======
func (d *dnsResolver) lookupHost() ([]resolver.Address, error) {
	addrs, err := d.resolver.LookupHost(d.ctx, d.host)
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
func (d *dnsResolver) lookupHost() ([]resolver.Address, error) {
	addrs, err := d.resolver.LookupHost(d.ctx, d.host)
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	if err != nil {
		err = handleDNSError(err, "A")
		return nil, err
	}
	newAddrs := make([]resolver.Address, 0, len(addrs))
	for _, a := range addrs {
		ip, ok := formatIP(a)
		if !ok {
			return nil, fmt.Errorf("dns: error parsing A record IP address %v", a)
		}
		addr := ip + ":" + d.port
		newAddrs = append(newAddrs, resolver.Address{Addr: addr})
	}
	return newAddrs, nil
}

func (d *dnsResolver) lookup() (*resolver.State, error) {
<<<<<<< HEAD
	srv, srvErr := d.lookupSRV()
	addrs, hostErr := d.lookupHost()
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
	srv, srvErr := d.lookupSRV()
	addrs, hostErr := d.lookupHost()
=======
<<<<<<< HEAD
>>>>>>> master
	ctx, cancel := context.WithTimeout(d.ctx, ResolvingTimeout)
	defer cancel()
	srv, srvErr := d.lookupSRV(ctx)
	addrs, hostErr := d.lookupHost(ctx)
<<<<<<< HEAD
=======
=======
	srv, srvErr := d.lookupSRV()
	addrs, hostErr := d.lookupHost()
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
	srv, srvErr := d.lookupSRV()
	addrs, hostErr := d.lookupHost()
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	if hostErr != nil && (srvErr != nil || len(srv) == 0) {
		return nil, hostErr
	}

	state := resolver.State{Addresses: addrs}
	if len(srv) > 0 {
		state = grpclbstate.Set(state, &grpclbstate.State{BalancerAddresses: srv})
	}
	if !d.disableServiceConfig {
<<<<<<< HEAD
		state.ServiceConfig = d.lookupTXT()
=======
<<<<<<< HEAD
<<<<<<< HEAD
		state.ServiceConfig = d.lookupTXT(ctx)
=======
<<<<<<< HEAD
		state.ServiceConfig = d.lookupTXT()
=======
<<<<<<< HEAD
		state.ServiceConfig = d.lookupTXT(ctx)
=======
		state.ServiceConfig = d.lookupTXT()
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
		state.ServiceConfig = d.lookupTXT()
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	}
	return &state, nil
}

// formatIP returns ok = false if addr is not a valid textual representation of
// an IP address. If addr is an IPv4 address, return the addr and ok = true.
// If addr is an IPv6 address, return the addr enclosed in square brackets and
// ok = true.
func formatIP(addr string) (addrIP string, ok bool) {
	ip := net.ParseIP(addr)
	if ip == nil {
		return "", false
	}
	if ip.To4() != nil {
		return addr, true
	}
	return "[" + addr + "]", true
}

// parseTarget takes the user input target string and default port, returns
// formatted host and port info. If target doesn't specify a port, set the port
// to be the defaultPort. If target is in IPv6 format and host-name is enclosed
// in square brackets, brackets are stripped when setting the host.
// examples:
// target: "www.google.com" defaultPort: "443" returns host: "www.google.com", port: "443"
// target: "ipv4-host:80" defaultPort: "443" returns host: "ipv4-host", port: "80"
// target: "[ipv6-host]" defaultPort: "443" returns host: "ipv6-host", port: "443"
// target: ":80" defaultPort: "443" returns host: "localhost", port: "80"
func parseTarget(target, defaultPort string) (host, port string, err error) {
	if target == "" {
<<<<<<< HEAD
		return "", "", errMissingAddr
=======
<<<<<<< HEAD
<<<<<<< HEAD
		return "", "", internal.ErrMissingAddr
=======
<<<<<<< HEAD
		return "", "", errMissingAddr
=======
<<<<<<< HEAD
		return "", "", internal.ErrMissingAddr
=======
		return "", "", errMissingAddr
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
		return "", "", errMissingAddr
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	}
	if ip := net.ParseIP(target); ip != nil {
		// target is an IPv4 or IPv6(without brackets) address
		return target, defaultPort, nil
	}
	if host, port, err = net.SplitHostPort(target); err == nil {
		if port == "" {
			// If the port field is empty (target ends with colon), e.g. "[::1]:",
			// this is an error.
<<<<<<< HEAD
			return "", "", errEndsWithColon
=======
<<<<<<< HEAD
<<<<<<< HEAD
			return "", "", internal.ErrEndsWithColon
=======
<<<<<<< HEAD
			return "", "", errEndsWithColon
=======
<<<<<<< HEAD
			return "", "", internal.ErrEndsWithColon
=======
			return "", "", errEndsWithColon
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
			return "", "", errEndsWithColon
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
		}
		// target has port, i.e ipv4-host:port, [ipv6-host]:port, host-name:port
		if host == "" {
			// Keep consistent with net.Dial(): If the host is empty, as in ":80",
			// the local system is assumed.
			host = "localhost"
		}
		return host, port, nil
	}
	if host, port, err = net.SplitHostPort(target + ":" + defaultPort); err == nil {
		// target doesn't have port
		return host, port, nil
	}
	return "", "", fmt.Errorf("invalid target address %v, error info: %v", target, err)
}

type rawChoice struct {
	ClientLanguage *[]string        `json:"clientLanguage,omitempty"`
	Percentage     *int             `json:"percentage,omitempty"`
	ClientHostName *[]string        `json:"clientHostName,omitempty"`
	ServiceConfig  *json.RawMessage `json:"serviceConfig,omitempty"`
}

func containsString(a *[]string, b string) bool {
	if a == nil {
		return true
	}
	for _, c := range *a {
		if c == b {
			return true
		}
	}
	return false
}

func chosenByPercentage(a *int) bool {
	if a == nil {
		return true
	}
	return grpcrand.Intn(100)+1 <= *a
}

func canaryingSC(js string) string {
	if js == "" {
		return ""
	}
	var rcs []rawChoice
	err := json.Unmarshal([]byte(js), &rcs)
	if err != nil {
		logger.Warningf("dns: error parsing service config json: %v", err)
		return ""
	}
	cliHostname, err := os.Hostname()
	if err != nil {
		logger.Warningf("dns: error getting client hostname: %v", err)
		return ""
	}
	var sc string
	for _, c := range rcs {
		if !containsString(c.ClientLanguage, golang) ||
			!chosenByPercentage(c.Percentage) ||
			!containsString(c.ClientHostName, cliHostname) ||
			c.ServiceConfig == nil {
			continue
		}
		sc = string(*c.ServiceConfig)
		break
	}
	return sc
}
