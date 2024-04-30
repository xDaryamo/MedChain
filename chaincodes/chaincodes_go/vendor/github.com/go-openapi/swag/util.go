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
	"reflect"
	"strings"
	"unicode"
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
	"unicode/utf8"
)

// GoNamePrefixFunc sets an optional rule to prefix go names
// which do not start with a letter.
//
// The prefix function is assumed to return a string that starts with an upper case letter.
//
<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
)

// commonInitialisms are common acronyms that are kept as whole uppercased words.
var commonInitialisms *indexOfInitialisms

// initialisms is a slice of sorted initialisms
var initialisms []string

var isInitialism func(string) bool

// GoNamePrefixFunc sets an optional rule to prefix go names
// which do not start with a letter.
//
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
// e.g. to help convert "123" into "{prefix}123"
//
// The default is to prefix with "X"
var GoNamePrefixFunc func(string) string

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
func prefixFunc(name, in string) string {
	if GoNamePrefixFunc == nil {
		return "X" + in
	}

	return GoNamePrefixFunc(name) + in
<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
func init() {
	// Taken from https://github.com/golang/lint/blob/3390df4df2787994aea98de825b964ac7944b817/lint.go#L732-L769
	var configuredInitialisms = map[string]bool{
		"ACL":   true,
		"API":   true,
		"ASCII": true,
		"CPU":   true,
		"CSS":   true,
		"DNS":   true,
		"EOF":   true,
		"GUID":  true,
		"HTML":  true,
		"HTTPS": true,
		"HTTP":  true,
		"ID":    true,
		"IP":    true,
		"IPv4":  true,
		"IPv6":  true,
		"JSON":  true,
		"LHS":   true,
		"OAI":   true,
		"QPS":   true,
		"RAM":   true,
		"RHS":   true,
		"RPC":   true,
		"SLA":   true,
		"SMTP":  true,
		"SQL":   true,
		"SSH":   true,
		"TCP":   true,
		"TLS":   true,
		"TTL":   true,
		"UDP":   true,
		"UI":    true,
		"UID":   true,
		"UUID":  true,
		"URI":   true,
		"URL":   true,
		"UTF8":  true,
		"VM":    true,
		"XML":   true,
		"XMPP":  true,
		"XSRF":  true,
		"XSS":   true,
	}

	// a thread-safe index of initialisms
	commonInitialisms = newIndexOfInitialisms().load(configuredInitialisms)
	initialisms = commonInitialisms.sorted()

	// a test function
	isInitialism = commonInitialisms.isInitialism
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
	// collectionFormatComma = "csv"
	collectionFormatSpace = "ssv"
	collectionFormatTab   = "tsv"
	collectionFormatPipe  = "pipes"
	collectionFormatMulti = "multi"
)

// JoinByFormat joins a string array by a known format (e.g. swagger's collectionFormat attribute):
//
//	ssv: space separated value
//	tsv: tab separated value
//	pipes: pipe (|) separated value
//	csv: comma separated value (default)
func JoinByFormat(data []string, format string) []string {
	if len(data) == 0 {
		return data
	}
	var sep string
	switch format {
	case collectionFormatSpace:
		sep = " "
	case collectionFormatTab:
		sep = "\t"
	case collectionFormatPipe:
		sep = "|"
	case collectionFormatMulti:
		return data
	default:
		sep = ","
	}
	return []string{strings.Join(data, sep)}
}

// SplitByFormat splits a string by a known format:
//
//	ssv: space separated value
//	tsv: tab separated value
//	pipes: pipe (|) separated value
//	csv: comma separated value (default)
func SplitByFormat(data, format string) []string {
	if data == "" {
		return nil
	}
	var sep string
	switch format {
	case collectionFormatSpace:
		sep = " "
	case collectionFormatTab:
		sep = "\t"
	case collectionFormatPipe:
		sep = "|"
	case collectionFormatMulti:
		return nil
	default:
		sep = ","
	}
	var result []string
	for _, s := range strings.Split(data, sep) {
		if ts := strings.TrimSpace(s); ts != "" {
			result = append(result, ts)
		}
	}
	return result
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
// Removes leading whitespaces
func trim(str string) string {
	return strings.TrimSpace(str)
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
// Removes leading whitespaces
func trim(str string) string {
	return strings.TrimSpace(str)
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
type byInitialism []string

func (s byInitialism) Len() int {
	return len(s)
}
func (s byInitialism) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s byInitialism) Less(i, j int) bool {
	if len(s[i]) != len(s[j]) {
		return len(s[i]) < len(s[j])
	}

	return strings.Compare(s[i], s[j]) > 0
}

// Removes leading whitespaces
func trim(str string) string {
	return strings.Trim(str, " ")
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

// Shortcut to strings.ToUpper()
func upper(str string) string {
	return strings.ToUpper(trim(str))
}

// Shortcut to strings.ToLower()
func lower(str string) string {
	return strings.ToLower(trim(str))
}

// Camelize an uppercased word
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
func Camelize(word string) string {
	camelized := poolOfBuffers.BorrowBuffer(len(word))
	defer func() {
		poolOfBuffers.RedeemBuffer(camelized)
	}()

	for pos, ru := range []rune(word) {
		if pos > 0 {
			camelized.WriteRune(unicode.ToLower(ru))
		} else {
			camelized.WriteRune(unicode.ToUpper(ru))
		}
	}
	return camelized.String()
<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
func Camelize(word string) (camelized string) {
	for pos, ru := range []rune(word) {
		if pos > 0 {
			camelized += string(unicode.ToLower(ru))
		} else {
			camelized += string(unicode.ToUpper(ru))
		}
	}
	return
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

// ToFileName lowercases and underscores a go type name
func ToFileName(name string) string {
	in := split(name)
	out := make([]string, 0, len(in))

	for _, w := range in {
		out = append(out, lower(w))
	}

	return strings.Join(out, "_")
}

// ToCommandName lowercases and underscores a go type name
func ToCommandName(name string) string {
	in := split(name)
	out := make([]string, 0, len(in))

	for _, w := range in {
		out = append(out, lower(w))
	}
	return strings.Join(out, "-")
}

// ToHumanNameLower represents a code name as a human series of words
func ToHumanNameLower(name string) string {
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
	s := poolOfSplitters.BorrowSplitter(withPostSplitInitialismCheck)
	in := s.split(name)
	poolOfSplitters.RedeemSplitter(s)
	out := make([]string, 0, len(*in))

	for _, w := range *in {
		if !w.IsInitialism() {
			out = append(out, lower(w.GetOriginal()))
		} else {
			out = append(out, trim(w.GetOriginal()))
		}
	}
	poolOfLexems.RedeemLexems(in)
<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	in := newSplitter(withPostSplitInitialismCheck).split(name)
	out := make([]string, 0, len(in))

	for _, w := range in {
		if !w.IsInitialism() {
			out = append(out, lower(w.GetOriginal()))
		} else {
			out = append(out, w.GetOriginal())
		}
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

	return strings.Join(out, " ")
}

// ToHumanNameTitle represents a code name as a human series of words with the first letters titleized
func ToHumanNameTitle(name string) string {
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
	s := poolOfSplitters.BorrowSplitter(withPostSplitInitialismCheck)
	in := s.split(name)
	poolOfSplitters.RedeemSplitter(s)

	out := make([]string, 0, len(*in))
	for _, w := range *in {
		original := trim(w.GetOriginal())
<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	in := newSplitter(withPostSplitInitialismCheck).split(name)

	out := make([]string, 0, len(in))
	for _, w := range in {
		original := w.GetOriginal()
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
		if !w.IsInitialism() {
			out = append(out, Camelize(original))
		} else {
			out = append(out, original)
		}
	}
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
	poolOfLexems.RedeemLexems(in)

=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
	poolOfLexems.RedeemLexems(in)

=======
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	return strings.Join(out, " ")
}

// ToJSONName camelcases a name which can be underscored or pascal cased
func ToJSONName(name string) string {
	in := split(name)
	out := make([]string, 0, len(in))

	for i, w := range in {
		if i == 0 {
			out = append(out, lower(w))
			continue
		}
<<<<<<< HEAD
		out = append(out, Camelize(w))
=======
<<<<<<< HEAD
<<<<<<< HEAD
		out = append(out, Camelize(trim(w)))
=======
<<<<<<< HEAD
		out = append(out, Camelize(w))
=======
<<<<<<< HEAD
		out = append(out, Camelize(trim(w)))
=======
		out = append(out, Camelize(w))
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
		out = append(out, Camelize(w))
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	}
	return strings.Join(out, "")
}

// ToVarName camelcases a name which can be underscored or pascal cased
func ToVarName(name string) string {
	res := ToGoName(name)
	if isInitialism(res) {
		return lower(res)
	}
	if len(res) <= 1 {
		return lower(res)
	}
	return lower(res[:1]) + res[1:]
}

// ToGoName translates a swagger name which can be underscored or camel cased to a name that golint likes
func ToGoName(name string) string {
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> master
	s := poolOfSplitters.BorrowSplitter(withPostSplitInitialismCheck)
	lexems := s.split(name)
	poolOfSplitters.RedeemSplitter(s)
	defer func() {
		poolOfLexems.RedeemLexems(lexems)
	}()
	lexemes := *lexems

	if len(lexemes) == 0 {
		return ""
	}

	result := poolOfBuffers.BorrowBuffer(len(name))
	defer func() {
		poolOfBuffers.RedeemBuffer(result)
	}()

	// check if not starting with a letter, upper case
	firstPart := lexemes[0].GetUnsafeGoName()
	if lexemes[0].IsInitialism() {
		firstPart = upper(firstPart)
	}

	if c := firstPart[0]; c < utf8.RuneSelf {
		// ASCII
		switch {
		case 'A' <= c && c <= 'Z':
			result.WriteString(firstPart)
		case 'a' <= c && c <= 'z':
			result.WriteByte(c - 'a' + 'A')
			result.WriteString(firstPart[1:])
		default:
			result.WriteString(prefixFunc(name, firstPart))
			// NOTE: no longer check if prefixFunc returns a string that starts with uppercase:
			// assume this is always the case
		}
	} else {
		// unicode
		firstRune, _ := utf8.DecodeRuneInString(firstPart)
		switch {
		case !unicode.IsLetter(firstRune):
			result.WriteString(prefixFunc(name, firstPart))
		case !unicode.IsUpper(firstRune):
			result.WriteString(prefixFunc(name, firstPart))
			/*
				result.WriteRune(unicode.ToUpper(firstRune))
				result.WriteString(firstPart[offset:])
			*/
		default:
			result.WriteString(firstPart)
		}
	}

	for _, lexem := range lexemes[1:] {
<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	lexems := newSplitter(withPostSplitInitialismCheck).split(name)

	result := ""
	for _, lexem := range lexems {
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
		goName := lexem.GetUnsafeGoName()

		// to support old behavior
		if lexem.IsInitialism() {
			goName = upper(goName)
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
		result.WriteString(goName)
	}

	return result.String()
<<<<<<< HEAD
=======
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
		result += goName
	}

	if len(result) > 0 {
		// Only prefix with X when the first character isn't an ascii letter
		first := []rune(result)[0]
		if !unicode.IsLetter(first) || (first > unicode.MaxASCII && !unicode.IsUpper(first)) {
			if GoNamePrefixFunc == nil {
				return "X" + result
			}
			result = GoNamePrefixFunc(name) + result
		}
		first = []rune(result)[0]
		if unicode.IsLetter(first) && !unicode.IsUpper(first) {
			result = string(append([]rune{unicode.ToUpper(first)}, []rune(result)[1:]...))
		}
	}

	return result
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

// ContainsStrings searches a slice of strings for a case-sensitive match
func ContainsStrings(coll []string, item string) bool {
	for _, a := range coll {
		if a == item {
			return true
		}
	}
	return false
}

// ContainsStringsCI searches a slice of strings for a case-insensitive match
func ContainsStringsCI(coll []string, item string) bool {
	for _, a := range coll {
		if strings.EqualFold(a, item) {
			return true
		}
	}
	return false
}

type zeroable interface {
	IsZero() bool
}

// IsZero returns true when the value passed into the function is a zero value.
// This allows for safer checking of interface values.
func IsZero(data interface{}) bool {
	v := reflect.ValueOf(data)
	// check for nil data
<<<<<<< HEAD
	switch v.Kind() {
=======
<<<<<<< HEAD
<<<<<<< HEAD
	switch v.Kind() { //nolint:exhaustive
=======
<<<<<<< HEAD
	switch v.Kind() {
=======
<<<<<<< HEAD
	switch v.Kind() { //nolint:exhaustive
=======
	switch v.Kind() {
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
	switch v.Kind() {
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	case reflect.Interface, reflect.Map, reflect.Ptr, reflect.Slice:
		if v.IsNil() {
			return true
		}
	}

	// check for things that have an IsZero method instead
	if vv, ok := data.(zeroable); ok {
		return vv.IsZero()
	}

	// continue with slightly more complex reflection
<<<<<<< HEAD
	switch v.Kind() {
=======
<<<<<<< HEAD
<<<<<<< HEAD
	switch v.Kind() { //nolint:exhaustive
=======
<<<<<<< HEAD
	switch v.Kind() {
=======
<<<<<<< HEAD
	switch v.Kind() { //nolint:exhaustive
=======
	switch v.Kind() {
>>>>>>> master
>>>>>>> master
>>>>>>> master
=======
	switch v.Kind() {
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
	case reflect.String:
		return v.Len() == 0
	case reflect.Bool:
		return !v.Bool()
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		return v.Int() == 0
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uintptr:
		return v.Uint() == 0
	case reflect.Float32, reflect.Float64:
		return v.Float() == 0
	case reflect.Struct, reflect.Array:
		return reflect.DeepEqual(data, reflect.Zero(v.Type()).Interface())
	case reflect.Invalid:
		return true
	default:
		return false
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
=======
>>>>>>> master
=======
>>>>>>> 0f30e9007966f6f247e51ad0fdb53399afca4f5a
>>>>>>> master
// AddInitialisms add additional initialisms
func AddInitialisms(words ...string) {
	for _, word := range words {
		// commonInitialisms[upper(word)] = true
		commonInitialisms.add(upper(word))
	}
	// sort again
	initialisms = commonInitialisms.sorted()
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
// CommandLineOptionsGroup represents a group of user-defined command line options
type CommandLineOptionsGroup struct {
	ShortDescription string
	LongDescription  string
	Options          interface{}
}
