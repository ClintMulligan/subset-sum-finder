// subset-sum-finder

// MODULE JSDOC
/**
 * @module subset-sum-finder
 * @desc This module takes a given set of integers (whole numbers that are 
 * negative, zero, or positive) and attempts to find all subsets (unique -
 * groupings) that add up to a given target integer.
 *
 * @see <a href="https://en.wikipedia.org/wiki/Subset_sum_problem">Subset sum problem</a>.
 * @version 0.0.1
 * @author Clint Mulligan
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
 * @requires     module:./utility.mjs
 * @requires     module: readline
 */

// UTILITIES
// Make the code easir to read, utilizing some self spun functions.
import { absolute } from "./utility.mjs"
import { convertToString } from "./utility.mjs"
import { convertToObject } from "./utility.mjs"
import { descendNumbers } from "./utility.mjs"
import { into } from "./utility.mjs"
import { markDuplicates } from "./utility.mjs"
import { noDecimals } from "./utility.mjs"
import { outOf } from "./utility.mjs"
import { sumNumbers } from "./utility.mjs"
import { washContainer } from "./utility.mjs"

// NATIVE NODEJS MODULES
import * as readline from "readline"

// PREPARE SHARED PILES
let stack = []
let answers = []
let trash = []

const inquiry = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function getInputs() {
  inquiry.question("Please enter in a comma seperated list of integers : ", (answer1) => {
    inquiry.question("Please enter a target sum : ", (answer2) => {
      let inputSet = answer1.split(',').map(Number)
      let inputSum = Number(answer2)
      findSubsetSums(inputSet, inputSum)
    })
  })
}

function findSubsetSums(inputSet, inputSum) {
  let targetSum = inputSum
  let solutionSum = null
  let solutionSet = []
  let positiveSum = sumNumbers(inputSet.filter(x => x >= 0))
  let negativeSum = sumNumbers(inputSet.filter(x => x < 0))
  let markPositives = markDuplicates(inputSet.filter(x => x >= 0).sort(descendNumbers))
  let markNegatives = markDuplicates(inputSet.filter(x => x < 0).map((x) => absolute(x)).sort(descendNumbers))
  let problemSet = [...markNegatives.map(x => 0 - x), ...markPositives]
  let currentNeed = inputSum

  let jsonObject = {
    "targetSum": targetSum,
    "solutionSum": solutionSum,
    "solutionSet": solutionSet,
    "problemSet": problemSet,
    "positiveSum": positiveSum,
    "negativeSum": negativeSum,
    "currentNeed": currentNeed
  }
  let packet = convertToString(jsonObject)
  into(stack, packet)

  const startTime = process.hrtime();
  reduceStack()
  const endTime = process.hrtime(startTime)
  console.log("")
  console.log("Execution time (hr): %ds %dms", endTime[0], endTime[1] / 1000000)
  presentAnswers()
}

function reduceStack() {
  sortStack: while (stack.length !== 0) {
    let p = convertToObject(outOf(stack))

    // DEAD BRANCH
    if (p.problemSet.length === 0 && p.targetSum !== p.solutionSum) {
      into(trash, convertToString(p))
      continue sortStack
    }

    // ZERO SUM SUBSTITUTIONS: Solution achieved but zero sum combinations may be added. Can be commented out.
    if (p.problemSet.length !== 0 && p.targetSum === p.solutionSum) {
      into(answers, convertToString(p))
      p.solutionSum = null
      p.targetSum = 0
      into(stack, convertToString(p))
      continue sortStack
    }

    // SOLUTION FOUND
    if (p.problemSet.length === 0 && p.targetSum === p.solutionSum) {
      into(answers, convertToString(p))
      continue sortStack
    }

    // WORK
    if (p.problemSet.length !== 0 && p.targetSum !== p.solutionSum) {

      considerN: while (p.problemSet.length !== 0) {
        let actualNumber = p.problemSet[p.problemSet.length - 1]
        let n = noDecimals(actualNumber)
        let oppositeSign = n < 0 ? p.positiveSum : p.negativeSum
        let sameSign = n < 0 ? p.negativeSum : p.positiveSum
        

        // TOO BIG
        if (absolute(n) > absolute(p.currentNeed - oppositeSign) && n !== p.currentNeed) {
          n < 0 ? p.negativeSum = p.negativeSum - n : p.positiveSum = p.positiveSum - n
          outOf(p.problemSet)
          continue considerN
        }

        // TOO SMALL
        if (sameSign < p.currentNeed && n !== p.currentNeed) {
          break considerN
        }

        into(p.solutionSet, actualNumber)
        n < 0 ? p.negativeSum = p.negativeSum - n : p.positiveSum = p.positiveSum - n
        p.solutionSum = p.solutionSum + n
        p.currentNeed = p.currentNeed - n
        outOf(p.problemSet)
        let copyPacket = convertToString(p)

        // Reverse Construction of Duplicate packet
        outOf(p.solutionSet)
        p.solutionSum = p.solutionSum - n
        p.currentNeed = p.currentNeed + n

        // Send new packet to Stack and grab next "n"
        into(stack, copyPacket)
        continue considerN
      }
    }
  }
}

function presentAnswers() {
  // UNCOMMENT to display packets moved to the trash stack, ie. dead branches.
  // console.log("")
  // console.log(`There were ${trash.length} Dead Branches dropped in trash...`)
  // console.log(trash)
   
  console.log("")
  console.log(`There were ${answers.length} solution sets found...`)
  while (answers.length !== 0) {
    let p = convertToObject(outOf(answers))
    let solutionSet = [...p.solutionSet]

    function subscriptDecimals(number) {
      let wholeNumber = number < 0 ? Math.ceil(number) : Math.floor(number)
      let stringNumber = number.toString()
      let decimal = stringNumber.slice(-3)
      let labelNumber = decimal.replace("(?<=\\b|\\G)0(?=\\d)", "")
      let label = String.fromCharCode(96 + Number(labelNumber))
      if (wholeNumber - number === 0) {
        return number
      }
      return wholeNumber + label
    }

    let answer = solutionSet.map(subscriptDecimals).toString()
    answer.replace(/,/g, "newchar")
    answer = "{ " + answer + " }"
    console.log(answer)
    
  }

  getInputs()
}

getInputs()
