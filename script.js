const $homePage = document.getElementById("home")
const $choosePage = document.getElementById("choose")
const $resultPage = document.getElementById("result")
const $collectionsPage = document.getElementById("collections")
const $goChoosePage = document.getElementById("go-choose")
const $goResultPage = document.getElementById("go-result")
const $goCollectionsPage = document.getElementById("go-collections")
const $resultCollectionsPage = document.getElementById("result-go-collections")
const $goBackToChoosePage = document.getElementById("another-date-btn")
const $addCollectionBtn = document.getElementById("add-collection-btn")
const $collectionGoBack = document.getElementById("back-to-choose")
const $dateInput = document.getElementById("date")
const $anotherDateInput = document.getElementById("anotherDate")
const $confirmDate = document.getElementById("confirm-date")
const $anotherDayConfirm = document.getElementById("another-date-btn")
const $photosNum = document.querySelector(".collections-num")
const $showImg = document.getElementById("show-img")
const $imgInfo = document.getElementById("img-info")
const $hdImage = document.getElementById("hd-image")
const $collectionImageWrapper = document.getElementById("collection-image-wrapper")

const bigMonth = [1, 3, 5, 7, 8, 10, 12]
const smallMonth = [4, 6, 9, 11]
let currentPictureData = []
let savedData = JSON.parse(localStorage.getItem("savedData")) || []

let apiKey = "Hs8uyo5VmbJjiQVE9Lgmf0gBrMk00gzJeCKyf4gS"
let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=`

$dateInput.addEventListener('change', function(e) {
   // console.log(e.target.value)
   if (!checkDateInput(e.target.value)) {
      alert("Please select a past date")
   } else {
      $confirmDate.textContent = e.target.value
      url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${e.target.value}`
   }
})

$anotherDateInput.addEventListener('change', function(e) {
   if (!checkDateInput(e.target.value)) {
      alert("Please select a past date")
   } else {
      url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${e.target.value}`
   }
})

$anotherDayConfirm.addEventListener('click', async function(e) {
   e.preventDefault()
   $addCollectionBtn.innerHTML = `<i class="fa-regular fa-square-plus"></i>`
   const res = await fetch(url)
   const data = await res.json()
   if (data.media_type === "image") {
      $showImg.innerHTML = ""
      const displayImage = document.createElement("img")
      displayImage.src = data.url
      displayImage.className = "img-fluid"
      $showImg.append(displayImage)
      
      displayImage.addEventListener('click', function(e) {
         $hdImage.className = "hd-image"
         $hdImage.innerHTML = `
         <img class="img-fluid" src=${data.hdurl} alt="">
         `
      })
   } else {
      $showImg.innerHTML = `
         <video>
            <source src=${data.url} type="video/mp4">
         </video>
      `
   }
   $imgInfo.innerHTML = `
   <p class="fw-bold">${data.title}</p>
   <p>${data.explanation}</p>
   <p>Image Credit: ${data.copyright}</p>
   <p>Data: ${data.date}</p>
   `
   currentPictureData = data
   setResultPage()
})

// check if the value input is greater than today's date
function checkDateInput(value) {
   const today = new Date()
   const year = today.getFullYear().toString()
   const month = today.getMonth() < 9 ? `0${(today.getMonth() + 1).toString()}` : (today.getMonth() + 1).toString()
   const day = today.getDate() < 10 ? `0${today.getDate().toString()}` : today.getDate().toString()
   const todayString = [year, month, day].join("-")
   // console.log(todayString)
   // console.log(value, todayString)
   if (value.toString() > todayString) {
      return false
   } else {
      return true
   }
}

// check if the picture was already added to favorite
function checkFavorite(current, target) {
   for (let t of target) {
      if (t.url === current.url) {
         return true
      }
   }
   return false
}

 function setHomePage() {
   $homePage.classList.remove("d-none")
   $choosePage.classList.add("d-none")
   $resultPage.classList.add("d-none")
   $collectionsPage.classList.add("d-none")
 }

 function setChoosePage() {
   $homePage.classList.add("d-none")
   $choosePage.classList.remove("d-none")
   $resultPage.classList.add("d-none")
   $collectionsPage.classList.add("d-none")
 }
 function setResultPage() {
   $homePage.classList.add("d-none")
   $choosePage.classList.add("d-none")
   $resultPage.classList.remove("d-none")
   $collectionsPage.classList.add("d-none")
 }
 function setCollectionsPage() {
   $homePage.classList.add("d-none")
   $choosePage.classList.add("d-none")
   $resultPage.classList.add("d-none")
   $collectionsPage.classList.remove("d-none")
   const savedPhotos = JSON.parse(localStorage.getItem("savedData")) || []
   if (savedPhotos.length == 1) {
   $photosNum.textContent = `${savedPhotos.length} photo`
   } else {
   $photosNum.textContent = `${savedPhotos.length} photos`
   }
   const collectionsImagesHTML = savedPhotos.map(function(savedPhoto) {
      return (
         `<div class="img-container col-sm-12 col-md-6 col-lg-4">
                <img src=${savedPhoto.url} alt=${savedPhoto.title}>
                <div class="img-option">
                    <div class="img-text">
                        <p>${savedPhoto.date}</p>
                        <p class="fw-bold">${savedPhoto.title}</p>
                    </div>
                    <p class="remove-photo"><i data-index = ${savedPhoto.date} class="fa-regular fa-square-minus"></i></p>
                </div>
            </div>
         `
      )
   })
   $collectionImageWrapper.innerHTML = collectionsImagesHTML.join("")
   const $removePhotos = [...document.querySelectorAll(".remove-photo")]
   console.log($removePhotos)
   $removePhotos.map(removePhoto => {
      removePhoto.addEventListener('click', function(e) {
         let current = []
         for (const currentPhoto of savedData) {
            if (currentPhoto.date == e.target.dataset.index) {
               current = currentPhoto
            }
         }
         console.log(savedData.indexOf(current))
         savedData.splice((savedData.indexOf(current)), 1)
         localStorage.setItem("savedData", JSON.stringify(savedData))
         setCollectionsPage()
      })
   })
 }

$goChoosePage.addEventListener('click', setChoosePage)
$goResultPage.addEventListener('click', async function() {
   $showImg.innerHTML = ""
   $addCollectionBtn.innerHTML = `<i class="fa-regular fa-square-plus"></i>`
   const res = await fetch(url)
   const data = await res.json()
   console.log(data)
   if (data.media_type === "image") {
      const displayImage = document.createElement("img")
      displayImage.src = data.url
      displayImage.className = "img-fluid"
      $showImg.append(displayImage)
      /* $showImg.innerHTML = `
         <img class="img-fluid" src=${data.url} alt="">
      ` */
      displayImage.addEventListener('click', function(e) {
         $hdImage.className = "hd-image"
         $hdImage.innerHTML = `
         <img class="img-fluid" src=${data.hdurl} alt="">
         `
      })
   } else {
      $showImg.innerHTML = `
         <video>
            <source src=${data.url} type="video/mp4">
         </video>
      `
   }
   $imgInfo.innerHTML = `
   <p class="fw-bold">${data.title}</p>
   <p>${data.explanation}</p>
   <p>Image Credit: ${data.copyright}</p>
   <p>Data: ${data.date}</p>
   `
   currentPictureData = data
   setResultPage()
})

// when click the hd image close the hd image container
$hdImage.addEventListener('click', function(e) {
   if(e.target.className === "img-fluid") {
      e.target.parentElement.className = "hd-img d-none"
   }
})

$addCollectionBtn.addEventListener('click', function() {
   if (checkFavorite(currentPictureData, savedData)) {
      alert("It already in your collection")
      $addCollectionBtn.innerHTML = `<i class="fa-solid fa-ban"></i>`
      
   } else {
      savedData.push(currentPictureData)
      localStorage.setItem("savedData", JSON.stringify(savedData))
      $addCollectionBtn.innerHTML = `Saved`
   } 
})

$goBackToChoosePage.addEventListener('click', setChoosePage)
$goCollectionsPage.addEventListener('click', setCollectionsPage)
$resultCollectionsPage.addEventListener('click', setCollectionsPage)
$collectionGoBack.addEventListener('click', setChoosePage)

