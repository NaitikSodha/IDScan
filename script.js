const fileSelector = document.querySelector('input')
const start = document.querySelector('button')
const img = document.querySelector('img')
const progress = document.querySelector('.progress')
const textarea = document.querySelector('textarea')

// first show image on upload
fileSelector.onchange = () => {
    var file = fileSelector.files[0]
    var imgUrl = window.URL.createObjectURL(new Blob([file], { type: 'image/jpg' }))
    img.src = imgUrl
}

// now start text recognition

start.onclick = () => {
    textarea.innerHTML = ''
    const rec = new Tesseract.TesseractWorker()
    rec.recognize(fileSelector.files[0])
        .progress(function (response) {
            if(response.status == 'recognizing text'){
                progress.innerHTML = response.status + '   ' + (response.progress.toFixed(2)*100) + '%'
            }else{
                progress.innerHTML = response.status
            }
        })
        .then(function (data) {
            // Extracted text
            const extractedText = data.text;
            // Extracted name
            const nameMatch = extractedText.match(/\b[A-Z]{3,}\b/g); // Match three or more consecutive words in all caps
            const name = nameMatch ? nameMatch.join(' ') : 'Name not found';
			const words = name.split(' ');
			let tIndex;
			const yearIndex = words.indexOf("YEAR");
			const branchIndex = words.indexOf("BRANCH");
			tIndex = yearIndex !== -1 ? yearIndex : branchIndex;
			const wordsBefore = words.slice(tIndex - 3, tIndex);
			const fname = wordsBefore[1].charAt(0).toUpperCase() + wordsBefore[1].slice(1).toLowerCase()+' '+wordsBefore[0].charAt(0).toUpperCase() + wordsBefore[0].slice(1).toLowerCase();
            // Extracted phone number
            const numberMatch = extractedText.match(/Contact\s*;?:\s*([0-9\s]+)/);
            const number = numberMatch ? numberMatch[1].replace(/\s/g, '') : 'Number not found';
            // Display the extracted information with line breaks
            textarea.innerHTML = `Name: ${fname}\nNumber: ${number}`;
            progress.innerHTML = 'Done'
        })
}


