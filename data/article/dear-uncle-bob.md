Title:      Dear Uncle Bob!
Author:     janoszen
Published:  0000-00-00
Categories: basics
Excerpt:       
Social:     /images/dear-uncle-bob/social.png
Decor:      /images/dear-uncle-bob/decor.png
Decor2x:    /images/dear-uncle-bob/decor-2x.png

Please excuse my open letter out of the blue, we don't know each other personally, but I would like to reflect on your
latest blog post titled [The Dark Path](http://blog.cleancoder.com/uncle-bob/2017/01/11/TheDarkPath.html). This blog
post was released quite [close to my own on this topic](/nullable) and I would like to take the time to explain why I,
respectfully, disagree with what you wrote.

But before we do that, let's set the scene so everyone reading this can understand what this is about.

Your blogpost complains about how deeply statically typed, or rather how strict, languages like Kotlin and Swift are.
All exceptions are checked, and all null returns must be explicitly checked for use. All this, in your opinion, is
unnecessary because it can be avoided with proper testing.

Now, let's take a language like Java. No compile-time null checks, not even a built-in way to specify if a return type
or method parameter can or cannot be null.

I write libraries for other people to use. Since I don't have the means to force the compiler to check the data that is
passed to my library, or specify an interface that forces to return a non-null type from a method, I have to expend
valuable CPU cycles, and indeed lines of code, to check for null.

As you yourself have stated, 50% of developers have less than five years of experience. Let's set the fact aside that
we are very far from the point where all software companies have automated tests for a moment. The problem is that,
as far as I know, there is no accurate definition of “enough tests”. As you well know, 100% per-line test coverage does
not ensure that there are no bugs. Writing tests is hard, and inexperienced developers don't necessarily write tests
that cover all significant cases.

What's worse, a lot of libraries are not as well documented as they should be, and we sometimes also don't have the
source code. In other words, we don't know all the cases when said library will accept or return null. Certain edge
cases can elude the development process.

I think that tools should make the safe or right way the path of least resistance. Inexperienced developers should be
lead to code in a safe way until they are ready to shed the training wheels and write potentially unsafe code.

This could be solved by creating an operator that wraps potentially unsafe code, something like this:

```java
unsafe {
  example.getExample().someMethod();
}
```

Or you could mark methods as unsafe:

```java
public unsafe void doSomething() {
  example.getExample().someMethod();
}
```

Much like `synchronized`, you wouldn't need this a lot since handling `null` values is not something that you want to
leave unhandled.

So much for `null`, what about exceptions? Exceptions have been created to *avoid* having to return values through
multiple layers of code. Having to pave the way for exceptions not only reverts that feature, it also violates the
single responsibility principle since every piece of code having an exception passing through need to know about them.
