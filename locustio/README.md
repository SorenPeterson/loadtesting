Prerequisites:

pip install locustio
pip install pyzmq

Pros:
* I like how easy it is to setup a flow.
* Being able to weight tasks makes it better for emulating a real world scenario.

Cons:
* It's frustrating how I have to pass auth every time I make a request. This should be configuring at another level because I will always need auth.
* I wish there were better ways to analyze the data programmatically.
* The data is too raw and not easy to digest.
* It groups request based on the URL, not the task. This creates serious problems when tokens are passed in the URL. It treats each url as a separate test.
