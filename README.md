cimentarius
===========

Cimenarius, latin, presumed to mean Mason.

Cimenarius, a Node.JS app, presumed to be a CMS framework, but we'll see where it goes...

A rough scratching ground for a 'ground up' CMS framework. In Node.js :)

Filesystem Layout
-----------------

<pre>
/cimenarius  - The base application and framework
+--/config      - Application installation configuration
+--/lib         - Internal runtime libraries
+--/models         - Database integration
|  +--/shelves        - Actual ORM models
|  +--/database       - ORM setup utils
|   +--/migrations     - Automatic DB upgraders
+--/tasks       - Grunt tasks
</pre>
