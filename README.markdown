Universal CSS Transforms 1.4 - A jQuery based cross browser CSS3 Transformation Library
===
by George Petrov, DMXzone.com


The **transform** CSS property is by definition a list of transformation functions.
This is probably the most complex type of css property (not a primitive value and not even a value list).
It is a combination of one or more (up to 11) different functions, each of witch can be used more than once.
Also, the order DOES matter.

Universal CSS Transforms is designed to be as simple to use, as possible. It attempts to provide
a "native" support for those transform functions to jQuery. It is neither possible to make this simple,
nor possible to support this in the jQuery way, so we have chosen different approach here.
For the sake of functionality and simplicity, we do limit the transform property to a set of 
unique functions only. For example, if an element has a rotation and skew applied, setting a rotation 
will replace the existing one (in other words, each transform functions, can be used only once).
This brings some limitations, but still covers 90% of use cases and allows us to make other
useful things, like supporting our own css properties and mixing them with the regular ones...


Example
---
Here are some usage examples

## Single argument

    * as number: $(element).css("skew", 30);
    
    * as string: $(element).css("skew", "30");
                 $(element).css("skew", "30deg");
                 $(element).css("skew", "-=30");
                 $(element).css("skew", "-=30deg");
                 
    * as array: $(element).css("skew", [30]);
                $(element).css("skew", ["30"]);
                $(element).css("skew", ["30deg"]);
                $(element).css("skew", ["+=30"]);

## Multiple arguments

    * as string: $(element).css("skew", "30, 22deg");
                 $(element).css("skew", "30, 20");
                 $(element).css("skew", "-=30, +=2");
                 $(element).css("skew", "-=30deg, 44");
                 
    * as array: $(element).css("skew", [30, "22deg"]);
                $(element).css("skew", [30, 20]);
                $(element).css("skew", ["-=30", "+=2"]);
                $(element).css("skew", ["-=30deg", 44]);

Documentation
---
You can find full API documentation for the project on it's github wiki:
http://github.com/gpetrov/Universal-CSS-Transforms/wiki

License (MIT)
---
Copyright (c) 2010 George Petrov, DMXzone.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.