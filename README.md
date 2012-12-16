# neogaf-replies

This is a little toy app I built. It provides a simple web interface that automates this workflow:

1. Log in to the NeoGAF message board
2. Gathers the first page of search results for posts authored by yourself
3. Starting at the point in the thread at which you commented, search three subsequent pages for instances of others quoting you.
4. Gather all these replies, format, and sort them.
5. Send them back to the client as JSON and provide links back into NeoGAF.

## login page

![Login](http://i.minus.com/ib11vszgY5ZYWr.PNG)

Here you can login with your NeoGAF credentials. Your password is converted to an md5 hex sum on the client and is neither persisted on the server or logged out.

## replies page

![Replies](http://i.minus.com/ildyUmv5XdCSp.PNG)

Here you can fetch more (which will search for as many replies as possible within a 30-second timebox) replies. It'll cache your already-fetched replies in localStorage so you can leave the page and come back to it without incurring the cost of re-fetching.

You can also clear the replies out if anything goes wrong, or log yourself out (with a button at the bottom of the page).