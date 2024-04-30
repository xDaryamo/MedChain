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

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
import (
	"unicode"
	"unicode/utf8"
)

type (
	lexemKind uint8

	nameLexem struct {
		original          string
		matchedInitialism string
		kind              lexemKind
	}
)

const (
	lexemKindCasualName lexemKind = iota
	lexemKindInitialismName
)

func newInitialismNameLexem(original, matchedInitialism string) nameLexem {
	return nameLexem{
		kind:              lexemKindInitialismName,
<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
import "unicode"

type (
	nameLexem interface {
		GetUnsafeGoName() string
		GetOriginal() string
		IsInitialism() bool
	}

	initialismNameLexem struct {
		original          string
		matchedInitialism string
	}

	casualNameLexem struct {
		original string
	}
)

func newInitialismNameLexem(original, matchedInitialism string) *initialismNameLexem {
	return &initialismNameLexem{
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
		original:          original,
		matchedInitialism: matchedInitialism,
	}
}

<<<<<<< HEAD
func newCasualNameLexem(original string) *casualNameLexem {
	return &casualNameLexem{
=======
<<<<<<< HEAD
<<<<<<< HEAD
func newCasualNameLexem(original string) nameLexem {
	return nameLexem{
		kind:     lexemKindCasualName,
=======
<<<<<<< HEAD
func newCasualNameLexem(original string) *casualNameLexem {
	return &casualNameLexem{
=======
<<<<<<< HEAD
func newCasualNameLexem(original string) nameLexem {
	return nameLexem{
		kind:     lexemKindCasualName,
=======
func newCasualNameLexem(original string) *casualNameLexem {
	return &casualNameLexem{
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
func newCasualNameLexem(original string) *casualNameLexem {
	return &casualNameLexem{
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
		original: original,
	}
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
func (l nameLexem) GetUnsafeGoName() string {
	if l.kind == lexemKindInitialismName {
		return l.matchedInitialism
	}

	var (
		first rune
		rest  string
	)

<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
func (l *initialismNameLexem) GetUnsafeGoName() string {
	return l.matchedInitialism
}

func (l *casualNameLexem) GetUnsafeGoName() string {
	var first rune
	var rest string
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
	for i, orig := range l.original {
		if i == 0 {
			first = orig
			continue
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
>>>>>>> master
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
		if i > 0 {
			rest = l.original[i:]
			break
		}
	}
<<<<<<< HEAD
	if len(l.original) > 1 {
		return string(unicode.ToUpper(first)) + lower(rest)
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
	if len(l.original) > 1 {
		return string(unicode.ToUpper(first)) + lower(rest)
=======
<<<<<<< HEAD
>>>>>>> master

	if len(l.original) > 1 {
		b := poolOfBuffers.BorrowBuffer(utf8.UTFMax + len(rest))
		defer func() {
			poolOfBuffers.RedeemBuffer(b)
		}()
		b.WriteRune(unicode.ToUpper(first))
		b.WriteString(lower(rest))
		return b.String()
<<<<<<< HEAD
=======
=======
	if len(l.original) > 1 {
		return string(unicode.ToUpper(first)) + lower(rest)
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
	if len(l.original) > 1 {
		return string(unicode.ToUpper(first)) + lower(rest)
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	}

	return l.original
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
func (l nameLexem) GetOriginal() string {
	return l.original
}

func (l nameLexem) IsInitialism() bool {
	return l.kind == lexemKindInitialismName
<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
func (l *initialismNameLexem) GetOriginal() string {
	return l.original
}

func (l *casualNameLexem) GetOriginal() string {
	return l.original
}

func (l *initialismNameLexem) IsInitialism() bool {
	return true
}

func (l *casualNameLexem) IsInitialism() bool {
	return false
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
