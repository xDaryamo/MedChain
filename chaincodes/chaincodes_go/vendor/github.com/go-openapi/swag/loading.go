// Copyright 2015 go-swagger maintainers
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package swag

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
	"path"
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
	"path"
=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

// LoadHTTPTimeout the default timeout for load requests
var LoadHTTPTimeout = 30 * time.Second

// LoadHTTPBasicAuthUsername the username to use when load requests require basic auth
var LoadHTTPBasicAuthUsername = ""

// LoadHTTPBasicAuthPassword the password to use when load requests require basic auth
var LoadHTTPBasicAuthPassword = ""

// LoadHTTPCustomHeaders an optional collection of custom HTTP headers for load requests
var LoadHTTPCustomHeaders = map[string]string{}

// LoadFromFileOrHTTP loads the bytes from a file or a remote http server based on the path passed in
<<<<<<< HEAD
func LoadFromFileOrHTTP(path string) ([]byte, error) {
	return LoadStrategy(path, os.ReadFile, loadHTTPBytes(LoadHTTPTimeout))(path)
=======
<<<<<<< HEAD
<<<<<<< HEAD
func LoadFromFileOrHTTP(pth string) ([]byte, error) {
	return LoadStrategy(pth, os.ReadFile, loadHTTPBytes(LoadHTTPTimeout))(pth)
=======
<<<<<<< HEAD
func LoadFromFileOrHTTP(path string) ([]byte, error) {
	return LoadStrategy(path, os.ReadFile, loadHTTPBytes(LoadHTTPTimeout))(path)
=======
<<<<<<< HEAD
func LoadFromFileOrHTTP(pth string) ([]byte, error) {
	return LoadStrategy(pth, os.ReadFile, loadHTTPBytes(LoadHTTPTimeout))(pth)
=======
func LoadFromFileOrHTTP(path string) ([]byte, error) {
	return LoadStrategy(path, os.ReadFile, loadHTTPBytes(LoadHTTPTimeout))(path)
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
func LoadFromFileOrHTTP(path string) ([]byte, error) {
	return LoadStrategy(path, os.ReadFile, loadHTTPBytes(LoadHTTPTimeout))(path)
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
}

// LoadFromFileOrHTTPWithTimeout loads the bytes from a file or a remote http server based on the path passed in
// timeout arg allows for per request overriding of the request timeout
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
func LoadFromFileOrHTTPWithTimeout(pth string, timeout time.Duration) ([]byte, error) {
	return LoadStrategy(pth, os.ReadFile, loadHTTPBytes(timeout))(pth)
}

// LoadStrategy returns a loader function for a given path or URI.
//
// The load strategy returns the remote load for any path starting with `http`.
// So this works for any URI with a scheme `http` or `https`.
//
// The fallback strategy is to call the local loader.
//
// The local loader takes a local file system path (absolute or relative) as argument,
// or alternatively a `file://...` URI, **without host** (see also below for windows).
//
// There are a few liberalities, initially intended to be tolerant regarding the URI syntax,
// especially on windows.
//
// Before the local loader is called, the given path is transformed:
//   - percent-encoded characters are unescaped
//   - simple paths (e.g. `./folder/file`) are passed as-is
//   - on windows, occurrences of `/` are replaced by `\`, so providing a relative path such a `folder/file` works too.
//
// For paths provided as URIs with the "file" scheme, please note that:
//   - `file://` is simply stripped.
//     This means that the host part of the URI is not parsed at all.
//     For example, `file:///folder/file" becomes "/folder/file`,
//     but `file://localhost/folder/file` becomes `localhost/folder/file` on unix systems.
//     Similarly, `file://./folder/file` yields `./folder/file`.
//   - on windows, `file://...` can take a host so as to specify an UNC share location.
//
// Reminder about windows-specifics:
// - `file://host/folder/file` becomes an UNC path like `\\host\folder\file` (no port specification is supported)
// - `file:///c:/folder/file` becomes `C:\folder\file`
// - `file://c:/folder/file` is tolerated (without leading `/`) and becomes `c:\folder\file`
func LoadStrategy(pth string, local, remote func(string) ([]byte, error)) func(string) ([]byte, error) {
	if strings.HasPrefix(pth, "http") {
		return remote
	}

	return func(p string) ([]byte, error) {
		upth, err := url.PathUnescape(p)
<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
func LoadFromFileOrHTTPWithTimeout(path string, timeout time.Duration) ([]byte, error) {
	return LoadStrategy(path, os.ReadFile, loadHTTPBytes(timeout))(path)
}

// LoadStrategy returns a loader function for a given path or uri
func LoadStrategy(path string, local, remote func(string) ([]byte, error)) func(string) ([]byte, error) {
	if strings.HasPrefix(path, "http") {
		return remote
	}
	return func(pth string) ([]byte, error) {
		upth, err := pathUnescape(pth)
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
		if err != nil {
			return nil, err
		}

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
		if !strings.HasPrefix(p, `file://`) {
			// regular file path provided: just normalize slashes
			return local(filepath.FromSlash(upth))
		}

		if runtime.GOOS != "windows" {
			// crude processing: this leaves full URIs with a host with a (mostly) unexpected result
			upth = strings.TrimPrefix(upth, `file://`)

			return local(filepath.FromSlash(upth))
		}

		// windows-only pre-processing of file://... URIs

		// support for canonical file URIs on windows.
		u, err := url.Parse(filepath.ToSlash(upth))
		if err != nil {
			return nil, err
		}

		if u.Host != "" {
			// assume UNC name (volume share)
			// NOTE: UNC port not yet supported

			// when the "host" segment is a drive letter:
			// file://C:/folder/... => C:\folder
			upth = path.Clean(strings.Join([]string{u.Host, u.Path}, `/`))
			if !strings.HasSuffix(u.Host, ":") && u.Host[0] != '.' {
				// tolerance: if we have a leading dot, this can't be a host
				// file://host/share/folder\... ==> \\host\share\path\folder
				upth = "//" + upth
			}
		} else {
			// no host, let's figure out if this is a drive letter
			upth = strings.TrimPrefix(upth, `file://`)
			first, _, _ := strings.Cut(strings.TrimPrefix(u.Path, "/"), "/")
			if strings.HasSuffix(first, ":") {
				// drive letter in the first segment:
				// file:///c:/folder/... ==> strip the leading slash
				upth = strings.TrimPrefix(upth, `/`)
<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
		if strings.HasPrefix(pth, `file://`) {
			if runtime.GOOS == "windows" {
				// support for canonical file URIs on windows.
				// Zero tolerance here for dodgy URIs.
				u, _ := url.Parse(upth)
				if u.Host != "" {
					// assume UNC name (volume share)
					// file://host/share/folder\... ==> \\host\share\path\folder
					// NOTE: UNC port not yet supported
					upth = strings.Join([]string{`\`, u.Host, u.Path}, `\`)
				} else {
					// file:///c:/folder/... ==> just remove the leading slash
					upth = strings.TrimPrefix(upth, `file:///`)
				}
			} else {
				upth = strings.TrimPrefix(upth, `file://`)
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

		return local(filepath.FromSlash(upth))
	}
}

func loadHTTPBytes(timeout time.Duration) func(path string) ([]byte, error) {
	return func(path string) ([]byte, error) {
		client := &http.Client{Timeout: timeout}
		req, err := http.NewRequest(http.MethodGet, path, nil) //nolint:noctx
		if err != nil {
			return nil, err
		}

		if LoadHTTPBasicAuthUsername != "" && LoadHTTPBasicAuthPassword != "" {
			req.SetBasicAuth(LoadHTTPBasicAuthUsername, LoadHTTPBasicAuthPassword)
		}

		for key, val := range LoadHTTPCustomHeaders {
			req.Header.Set(key, val)
		}

		resp, err := client.Do(req)
		defer func() {
			if resp != nil {
				if e := resp.Body.Close(); e != nil {
					log.Println(e)
				}
			}
		}()
		if err != nil {
			return nil, err
		}

		if resp.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("could not access document at %q [%s] ", path, resp.Status)
		}

		return io.ReadAll(resp.Body)
	}
}
