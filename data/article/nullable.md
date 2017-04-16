Title:      A few words on null
Author:     janoszen
Published:  2017-01-12
Categories: basics
Excerpt:    If you've ever seen a NullPointerException in a log, you know how frustrating it can be. You basically
            have no idea what happened and why. The stack trace is completely useless and you're left debugging an
            application that you didn't necessarily write. What is this and why does it happen? How do you avoid it?    
Social:     /images/nullable/social.png
Decor:      /images/nullable/decor.png
Decor2x:    /images/nullable/decor-2x.png

If you've ever seen a `NullPointerException` in a log, you know how frustrating it can be. You basically have no idea
what happened and why. Often the stack trace is completely useless and you're left debugging an application that you
didn't necessarily write. What is this and why does it happen? How do you avoid it?

> **Recommended reading:**
>
> * [Getting started in Object-Oriented Programming](/oop-basics)
> * [The loose, the strict and the static typing](/loose-strict-static)

## What is `null`?

Among beginner programmers, there's a great deal of confusion between `null` and the number zero (`0`). Generally
speaking, `null` in programming classically means “variable has no value”. But how did this come to be?

Let's look at this piece of classic C code:

```cpp
int test;
```

If you debug this, you'll find that `test` always have a value. If you don't initialize it, it'll have the value that
was left in memory from the previous owner. In other words, there is no way to set this variable to `null`.

What if we use a pointer instead?

```cpp
int * test;
```

Once set, this pointer points to a memory space that is the size of an integer. Let's set it:

```cpp
int * test = (int *)malloc(sizeof(int));
```

The test variable now points to a piece of memory that was allocated using the `malloc` call. What you may not know
that the pointer itself is internally an integer. If the integer had the value `0`, it would point to the first
byte of the memory, `1` if it would point to the second byte of the memory space, and so on. Since on most systems
you can't write to byte `0` of the memory, this value is also used as `null`.

## What happens when you use null?

In C, using a pointer that points to `0` will most likely result in a segmentation fault because byte 0 of the memory
belongs to the kernel.

In Java the situation is different. All classes are addressed by *reference*. Whenever the class is passed to a
different method, the reference is passed, not a copy of the class.

Let's examine this code:

```java
MyExampleClass example = new MyExampleClass();
```

In this case, `example` will be a reference to the newly created class. It isn't a pointer to a memory space, it points
to a slot in the resource table, but it can still take a `null` value. Therefore the following is a completely legal
piece of code:

```java
public MyExampleClass getExample() {
    return null;
}
```

Even though the method is supposed  to return an instance of `MyExampleClass`, it is returning null. If we now attempt
to call a method on the returned value, a `NullPointerException` is thrown:

```java
example.getExample().someMethod();
```

## Nullable

This reference-based class handling of Java (and many other languages) brings some implications with it. Every method
can return null instead of the expected class instance, and every class parameter passed can receive null instead of the
expected class. In other words, every class variable in Java is *nullable*. What's worse, there is no way to change it.

Why is this a problem? Take, for example, this piece of code from a blog engine:

```java
Author author = authorBackend.getBySlug("slug");
String name = author.getName();
```

Can we be sure, without looking at the code in `getBySlug()`, that author will not be null? No, we can't. Which means
that if we wanted to do this properly, our code would have to look something like this:

```java
Author author = authorBackend.getBySlug("slug");
if (author == null) {
  throw new AuthorLookupFailedException();
}
String name = author.getName();
```

Let's be honest, nobody does that for every single method call, that's just unrealistic.

## Situations to be careful about

Before we dive into the possible solutions, let's discuss the possible situations when you can run into a problem with
`null`.

### Returning data

The most obvious problem point when dealing with `null` are the points in your code when you return data. Let's look
at this example using the jsoup HTML parser:

```java
doc.select("test").first().html().text()
```

Every one of these function calls may or may not return `null` instead of the desired HTML tag. Before Java 8, the only
solution was to individually check every return value.

### Passing data to methods

The next usual problem point is something that is often encountered with weakly typed languages. A method awaiting
a class parameter in a language like Java can never be sure it isn't getting `null` instead.

```java
class MyClass {
  private String name;

  public MyClass(String name) {
    this.name = name;
  }
}
```

### Uninitialized class variables

When using class variables like in the example above, you can run into a situation where these variables are not
initialized properly. 

```java
class MyClass {
  private String name;

  public MyClass() {
  }
}
```

As you can see, the `name` variable is never initialize and therefore has a `null` value. If other methods in this class
attempt to use the variable, these will have to deal with it.

## Possible solutions

In Java, we don't have the possibility to explicitly mark a type as nullable or non-nullable. Other languages, like
Hacklang for example, give you this option. Depending on your programming language, you may have different options
available to you.

### Convention

When working in a closed group, you have the luxury of introducing a coding convention. One such convention could be
that everything is non-nullable unless you explicitly declare it `Nullable` with an annotation:


```java
@Nullable
public MyExampleClass doSomething() {
    return null;
}
```

This would alert everyone using this method that it can, in certain cases, return null. However, upholding
conventions is going to require a large degree of discipline, code reviews, and coaching for new colleagues. 

### Annotate

You can also annotate the other way around, mark everything with a `@Nonnull` annotation that's not nullable. This way
your IDE will at least warn you if you're about to violate the nullability of a variable.

```java
@Nonnull
public MyExampleClass doSomething() {
    //This will result in an IDE warning
    return null;
}
```

If you're not working in Java, you'll, of course, have to adapt the annotation/documentation to your own environment.

### Nullable/Optional classes

Instead of annotations, you could also use an explicit class that declares a variable or return type to be optional. 
In Java, for example:

```java
public Optional<MyExampleClass> doSomething() {
    //This will result in an IDE warning
    return Optional.ofNullable(null);
}
```

The `Optional` class will force the calling party to perform an explicit null check before they access the value stored
in the class. Similar facilities exist in other languages, or you can of course also implement your own.

### Languages with explicit nullability

Other languages (like C#) have taken a stricter approach with nullability. If you want a type to be nullable, you
explicitly have to mark it as such, for example with the question mark (`?`):

```csharp
public MyExampleClass? doSomething() {
    return null;
}
```

### Use exceptions

Instead of using null, you may want to consider using exceptions to indicate your inability to provide the requested
data. While this does not work in every situation, it is certainly useful when returning data.

## Communication is key

Let's assume that you have a method called `getAuthorBySlug()`. From the name, you would assume it returns an author.
You would not assume it to return anything else, would you?

Herein lies the problem. People don't think about `null` all that often when calling random methods. While I would argue
that in higher level languages using exceptions is a valid alternative to returning `null`, there are reasons against
that solution. (Exceptions are computationally expensive and the try-catch clause is rather wordy.)

At any rate, if you are going to return `null` from a method, it is imperative that you *communicate* this fact clearly,
either by adding the proper annotation, or by specifying an optional return type. And don't even think about writing it
in the text of your documentation, nobody reads that.