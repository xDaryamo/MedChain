<<<<<<< HEAD
=======
<<<<<<< HEAD
//go:build go1.19
// +build go1.19

=======
<<<<<<< HEAD
=======
//go:build go1.19
// +build go1.19

>>>>>>> master
>>>>>>> master
>>>>>>> master
package spec

import "net/url"

func parseURL(s string) (*url.URL, error) {
	u, err := url.Parse(s)
	if err == nil {
		u.OmitHost = false
	}
	return u, err
}
