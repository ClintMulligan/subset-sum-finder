# subset-sum-finder
[![](https://img.shields.io/github/license/ClintMulligan/subset-sum-finder.svg)](https://github.com/ClintMulligan/subset-sum-finder/blob/master/LICENSE)

A Branch-and-Bound technique that is selective about nodes to create in an attempt to solve the Subset Sum Problem quickly.

To run program:

1. Have installed Nodejs 10.0 or better
2. Have installed NPM
3. Download and unzip project folder.
4. Open a terminal up inside the subset-sum-finder-master folder, or Change Directory to the subset-sum-finder-master folder.
5. Use the command "npm start"

The program will run in the terminal, asking you for a set of integers and target sum.

Note: Be sure the list of integers is in similair format number comma number comma... no trailing comma.
Example: 5,4,2,-1,-3,0,4

You may use positives, signed negatives, zeroes, duplicates and be unordered. (The array is sorted before processing math)

The Code is based on a technique for solving Subset-sum problems by hand. In which a general tree is constructed, by asking if each element in the given set is Either Too Big or Too small to be a parent node, then recursively doing so for each subproblem created.
