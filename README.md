# neogaf-replies

This is a little toy app I built. It provides a simple web interface that automates this workflow.

1. Log in to the NeoGAF message board
2. Gathers the first page of search results for posts authored by yourself
3. Starting at the point in the thread at which you commented, search three subsequent pages for instances of others quoting you.
4. Gather all these replies, format, and sort them.
5. Send them back to the client as JSON and provide links back into NeoGAF.