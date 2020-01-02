const video = document.getElementById('video')
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),// compact models for face recognition
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'), // recognising different landmarks on the face
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'), // recognise where face is and draw box
    faceapi.nets.faceExpressionNet.loadFromUri('/models'), // recognise expressions
]).then(startVideo)
function startVideo(){
    navigator.getUserMedia(
        {video:{}},
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play',()=> {
    console.log('playing')
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = {
        width: video.width,
        height: video.height
    }
    faceapi.matchDimensions(canvas,displaySize)
    setInterval(
        async()=>{
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks().withFaceExpressions()
            console.log(detections)
            const resizedDetections = faceapi.resizeResults(detections,displaySize)
            canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
            faceapi.draw.drawDetections(canvas,resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas,resizedDetections)
        },100)
})