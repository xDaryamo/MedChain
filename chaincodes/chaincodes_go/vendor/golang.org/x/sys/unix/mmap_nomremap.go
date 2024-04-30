// Copyright 2023 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

<<<<<<< HEAD
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
=======
//go:build aix || darwin || dragonfly || freebsd || openbsd || solaris
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a

package unix

var mapper = &mmapper{
	active: make(map[*byte][]byte),
	mmap:   mmap,
	munmap: munmap,
}
