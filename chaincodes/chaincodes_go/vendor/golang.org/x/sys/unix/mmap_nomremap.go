// Copyright 2023 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

<<<<<<< HEAD
//go:build aix || darwin || dragonfly || freebsd || openbsd || solaris || zos
=======
<<<<<<< HEAD
//go:build aix || darwin || dragonfly || freebsd || openbsd || solaris
=======
<<<<<<< HEAD
//go:build aix || darwin || dragonfly || freebsd || openbsd || solaris || zos
=======
//go:build aix || darwin || dragonfly || freebsd || openbsd || solaris
>>>>>>> master
>>>>>>> master
>>>>>>> master

package unix

var mapper = &mmapper{
	active: make(map[*byte][]byte),
	mmap:   mmap,
	munmap: munmap,
}
