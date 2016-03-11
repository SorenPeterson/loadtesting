# The Dream

The tool I'm looking for has to meet certain needs. First I'll explain what I'm looking to do, and then I will talk about what I need from the tool.

The goal of this project is to automate performance testing of Jcard. In an ideal situation, we would have a performance testing suite. This suite, upon completion, would give us a good indication of how the new code has affected the performance of the application against the baseline. This would allow the tester to focus on only the parts of the code whose performance has changed.

In order to accomplish these goals, this tool must:
* Be able to store, parse and reuse a response in a subsequent request
* Be able to read data from a file and use it in requests
* Flood the system with as many requests as possible and measure the number of requests that go through
* Measure the performance of requests
* Group request statistics by some kind of tag

---

## Ruby Jmeter

#### Install:

gem install ruby-jmeter

#### About:
Ruby Jmeter takes the ruby code that you write and constructs a Jmeter test file. This limits it to the capabilities of Jmeter and doesn't allow you to full utilize Ruby's power.

#### Pros:
* Written in Ruby so existing programming skills are leveraged. Less mental effort spent doing new things
* You can make assertions on the data

#### Cons:
* You are somewhat limited by what you can do. You cannot, for instance, execute arbitrary code in the middle of your test.

---

## Locust IO

#### Prerequisites:

pip install locustio
pip install pyzmq

#### About:
Locust IO is by far my favorite of the options that I have explored so far. They provide a framework to help you structure your users and tasks and then get the heck out of the way. The benefit is that you can write any Python code that you want and it will be executed as you expect. It makes development of the suite very easy because you can hop in and debug at any point.

#### Pros:
* I like how easy it is to setup a flow.
* Being able to weight tasks makes it better for emulating a real world scenario.
* The framework allows you to insert arbitrary python operations at any point in the flow, this is a SERIOUS benefit above both Ruby Jmeter and Gatling IO

#### Cons:
* I wish there were better ways to analyze the data programmatically.

---

## Gatling IO

#### Prerequisites
To install gatling on mac you will need Java, Scala and Gatling.
Java: (Download form Oracle)
Scala: brew install
