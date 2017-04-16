Title:      What are Entity-Relationship diagrams?
Author:     janoszen
Published:  0000-00-00
Categories: basics
Excerpt:    If you are attending a university in an IT-related field, or you are diving into formal software design, you may very well come across the term Entity-Relationship diagram. What is it and why is it useful? How do you make the most of it?
Social:     /images/what-are-er-diagrams/social.png
Decor:      /images/what-are-er-diagrams/decor.png
Decor2x:    /images/what-are-er-diagrams/decor-2x.png

If you are attending a university in an IT-related field, or you are diving into formal software design, you may very well come across the term Entity-Relationship diagram. What is it and why is it useful? How do you make the most of it?

Peter Chen [invented the ER diagram (or ER model) in 1976](https://pdfs.semanticscholar.org/fdc8/b4381a3d9e81d308ac7c37a6cddde567383d.pdf) and is working on the concept ever since. His goal was to create a unified way of modeling data structures in a graphical way. For example, you could create an ER diagram for an 
online marketplace like this:

```dotsvg
digraph ER {
  splines  = ortho
  fontname = "Open Sans"
  fontsize = 12
  node [
    fontname = "Open Sans"
    fontsize = 12
  ]
  edge [
    splines  = ortho
    fontname = "Open Sans"
    fontsize = 12
  ]

  "Business entity" [label=<<font color="white">Business entity</font>>,shape=box, style=filled, fillcolor="#63bc46"];
  Address [label=<<font color="white">Address</font>>, shape=ellipse, style=filled, fillcolor="#4663bc"];
  Customer [label=<<font color="white">Customer</font>>, shape=box, style=filled, fillcolor="#63bc46"];
  Seller [label=<<font color="white">Seller</font>>, shape=box, style=filled, fillcolor="#63bc46"];
  Product [label=<<font color="white">Product</font>>, shape=box, style=filled, fillcolor="#63bc46"];
  offers [label=<<font color="white">offers</font>>, shape=diamond, style=filled, fillcolor="#bc4663"];
  buys [label=<<font color="white">buys</font>>, shape=diamond, style=filled, fillcolor="#bc4663"];

  Customer -> buys [dir=none,headlabel="*",taillabel="1"];
  buys -> Product [dir=none,headlabel="1",taillabel="\l*"];

  Seller -> offers [dir=none,headlabel="*",taillabel="1"];
  offers -> Product [dir=none,headlabel="1",taillabel="\l*"];

  Seller -> "Business entity" [arrowtail=standard];
  Customer -> "Business entity" [arrowtail=standard];

  "Business entity" -> Address [dir=none,headlabel="1",taillabel="1"];

  {rank=same "Business entity"} -> {rank=same Customer, Seller} -> {rank=same buys, offers} -> {rank=same Product} [style=invis];
}
```

The graphic above should be pretty intuitive, but let's break it down. If I was to describe the diagram above in 
textual form, it would look like this:

> *“Our online marketplace has **Customers** and **Sellers**. The two are completely separated, but we need to track the **address** for both, so let's call them **Business entities** together. The Seller **offers** a **Product**, which then the Customer **buys**. It is important to note that the Seller can offer multiple Products and the Customer can also buy multiple Products.”*

Needless to say, no project owner is ever going to write you a documentation that is this detailed, but you get the 
picture. The ER diagram describes a high-level business overview of the data present in your project.

If you look closely at my description, you can notice something. The highlighted words are *verbs* and *nouns*. 
Highlighting words like this can be really helpful when trying to build an ER model. As a simple rule nouns can 
always be transformed into entities, symbolized by rectangles. Verbs, on the other hand, can be transformed into 
*relations between entities*, symbolized by diamonds.

You can also annotate the relations by their cardinality. The number one (`1`) means that there is one, asterisk (`*`) 
signals there can be any amount of items on that side. You could also create more advanced constraints like `1..*`, 
which means at least one, or `0..1` which means at most one.

We also know that both Customer and Seller are a type of *Business entity*. They *inherit* all properties and 
relationships, hence the relationship is called an *inheritance*. Inheritance relationships are symbolized by an arrow.

Following these simple rules, the specification above should lead you to draw something like this:

```dotsvg
digraph ER {
  splines  = ortho
  fontname = "Open Sans"
  fontsize = 12
  node [
    fontname = "Open Sans"
    fontsize = 12
  ]
  edge [
    splines  = ortho
    fontname = "Open Sans"
    fontsize = 12
  ]

  "Business entity" [label=<<font color="white">Business entity</font>>,shape=box, style=filled, fillcolor="#63bc46"];
  Address [label=<<font color="white">Address</font>>, shape=box, style=filled, fillcolor="#63bc46", peripheries=2];
  Customer [label=<<font color="white">Customer</font>>, shape=box, style=filled, fillcolor="#63bc46"];
  Seller [label=<<font color="white">Seller</font>>, shape=box, style=filled, fillcolor="#63bc46"];
  Product [label=<<font color="white">Product</font>>, shape=box, style=filled, fillcolor="#63bc46"];
  offers [label=<<font color="white">offers</font>>, shape=diamond, style=filled, fillcolor="#bc4663"];
  buys [label=<<font color="white">buys</font>>, shape=diamond, style=filled, fillcolor="#bc4663"];
  has [label=<<font color="white">has</font>>, shape=diamond, style=filled, fillcolor="#bc4663", peripheries=2];

  Customer -> buys [dir=none,headlabel="*",taillabel="1"];
  buys -> Product [dir=none,headlabel="1",taillabel="\l*"];

  Seller -> offers [dir=none,headlabel="*",taillabel="1"];
  offers -> Product [dir=none,headlabel="1",taillabel="\l*"];

  Seller -> "Business entity" [arrowtail=standard];
  Customer -> "Business entity" [arrowtail=standard];

  "Business entity" -> has [dir=none,headlabel="1",taillabel="1"];
  has -> Address [dir=none,headlabel="1",taillabel="1"];

  {rank=same "Business entity"} -> {rank=same Customer, Seller} -> {rank=same buys, offers} -> {rank=same Product} [style=invis];
}
```

## Weak vs. strong entities

Entities are the participants of your data structure. There are two main types of entities. One being the strong 
entity, which can stand on its own, and weak entities that belong to some other entity. For example:

```dotsvg
digraph ER {
  splines  = ortho
  fontname = "Open Sans"
  fontsize = 12
  node [
    fontname = "Open Sans"
    fontsize = 12
  ]
  edge [
    splines  = ortho
    fontname = "Open Sans"
    fontsize = 12
  ]
  House [label=<<font color="white">House</font>>,shape=box, style=filled, fillcolor="#63bc46"];
  Apartment [label=<<font color="white">Apartment</font>>,shape="box", style=filled, fillcolor="#63bc46", peripheries=2];
  isin [label=<<font color="white">is in</font>>, shape=diamond, style=filled, fillcolor="#bc4663", peripheries=2];
  Address [label=<<font color="white">Address</font>>, shape=ellipse, style=filled, fillcolor="#4663bc"];
  Number [label=<<font color="white">Number</font>>, shape=ellipse, style=filled, fillcolor="#4663bc"];
  
  Apartment -> isin [dir=none,headlabel="1",taillabel="1"];
  isin -> House [dir=none,headlabel="1",taillabel="*"];
  
  House -> Address [dir=none,headlabel="1",taillabel="1"];
  Apartment -> Number [dir=none,headlabel="1",taillabel="1"];
  
  {rank=same "House","Apartment","isin"}[style=invis];
}
```

As you can see, an *Apartment* is not an entity in its own right because it cannot be uniquely identified by its attributes. You need the *House* it belongs to in order to identify an *Apartment*. *House*, on the other hand, can be 
uniquely identified by its *Address* attribute, which makes it a strong entity. The *is in* relation is called an 
*identifying relationship* because of it helps identify the *Apartment*.

## Properties

Let's go back to our original example, more specifically this relationship:

```dotsvg
digraph ER {
  splines  = ortho
  fontname = "Open Sans"
  fontsize = 12
  node [
    fontname = "Open Sans"
    fontsize = 12
  ]
  edge [
    splines  = ortho
    fontname = "Open Sans"
    fontsize = 12
  ]

  "Business entity" [label=<<font color="white">Business entity</font>>,shape=box, style=filled, fillcolor="#63bc46"];
  Address [label=<<font color="white">Address</font>>, shape=box, style=filled, fillcolor="#63bc46", peripheries=2];
  has [label=<<font color="white">has</font>>, shape=diamond, style=filled, fillcolor="#bc4663", peripheries=2];

  "Business entity" -> has [dir=none,headlabel="1",taillabel="1"];
  has -> Address [dir=none,headlabel="1",taillabel="1"];

  {rank=same "Business entity",has,Address}
}
```

This is a `1:1` relationship between two entities. One of the two entities (`Address`) is a weak entity, because it 
doesn't make any sense on its own. Also, the Address isn't tied to any other entity. In this case, it may very well 
make sense to demote `Address` to a property of `Business entity`.

```dotsvg
digraph ER {
  splines  = ortho
  fontname = "Open Sans"
  fontsize = 12
  node [
    fontname = "Open Sans"
    fontsize = 12
  ]
  edge [
    splines  = ortho
    fontname = "Open Sans"
    fontsize = 12
  ]

  "Business entity" [label=<<font color="white">Business entity</font>>,shape=box, style=filled, fillcolor="#63bc46"];
  Address [label=<<font color="white">Address</font>>, shape=ellipse, style=filled, fillcolor="#4663bc"];

  "Business entity" -> Address [dir=none,headlabel="1",taillabel="1"];
}
```

# Sources

- [The Entity-Relationship Model-Toward a Unified View of Data by Peter Pin-Shan Chen](https://pdfs.semanticscholar.org/fdc8/b4381a3d9e81d308ac7c37a6cddde567383d.pdf)

