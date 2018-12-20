// utility
// "use strict"

// MODULE JSDOC
/**
 * @module utility
 * @desc Some basic functions for sub-set-sum.mjs to make it easier to read
 *
 * @version 0.0.1
 *
 * @license BSD 3-Clause "New" or "Revised" License
 * BSD 3-Clause License
 * Copyright (c) 2018, Clinton Ray Mulligan
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * Neither the name of the copyright holder nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * 
 * USAGE: import { utilFunction as utilFunction } from "./utility.mjs"
 */

//  EXPORTS
export { absolute }
export { compareNumbers }
export { descendNumbers }
export { convertToString }
export { convertToObject }
export { fillContainer }
export { into }
export { isEmpty }
export { noDecimals }
export { outOf }
export { printMessage }
export { sumNumbers }
export { washContainer }
export { markDuplicates }

// FUNCTIONS
const absolute = (number) => Math.abs(number)
const compareNumbers = (x, y, ascend) => ascend !== false ? (x - y) : (y - x)
const convertToString = (object) => JSON.stringify(object)
const convertToObject = (string) => JSON.parse(string)
const descendNumbers = (x, y) => compareNumbers(x, y, false)
const fillContainer = (bucket, ...items) => bucket.push(...items)
const into = (queue, item) => queue.push(item)
const isEmpty = (array) => (array.length === 0)
const noDecimals = (number) => (number < 0) ?  Math.ceil(number) : Math.floor(number)
const outOf = (queue) => queue.pop()
const printMessage = (string, array) => array.push(string)

const sumNumbers = (array) => { let list = array.map(x => Math.floor(x)); return (isEmpty(list) === true) ? null : list.reduce((x, y) => x + y) }
const washContainer = (cup) => { while (cup.length !== 0) { cup.pop() } }

// For Presentation Purposes
function markDuplicates(array) {
    let marked = []
    let counter = 1
    while (array.length !== 0) {
        let bucketIndex = marked.length - 1
        let holding = array.pop()
        let index = array.length - 1
        let peeking = array[index]
        let label = counter / 1000

        if (holding !== peeking && holding === Math.floor(marked[bucketIndex])) {
            holding = holding + label
        }
        if (holding !== peeking) {
            counter = 1
            marked.push(holding)
        }
        if (holding === peeking) {
            holding = holding + label
            counter++
            marked.push(holding)
        }
    }
    return marked
}