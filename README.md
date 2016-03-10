# The Dream

The tool I'm looking for has to meet certain needs. First I'll explain what I'm looking to do, and then I will talk about what I need from the tool.

The goal of this project is to automate performance testing of Jcard. In an ideal situation, we would have a performance testing suite. This suite, upon completion, would give us a good indication of how the new code has affected the performance of the application against the baseline. This would allow the tester to focus on only the parts of the code whose performance has changed.

In order to accomplish these goals, this tool must:
* Be able to store, parse and reuse a response in a subsequent request
* Be able to read data from a file and use it in requests
* Flood the system with as many requests as possible and measure the number of requests that go through
* Measure the performance of requests
* Group request statistics by some kind of tag
