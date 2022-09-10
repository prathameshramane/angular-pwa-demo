importScripts('./ngsw-worker.js');

self.addEventListener('sync', (event) => {
    if(event.tag == 'post-data'){
        event.waitUntil(addPost());
    }
})

const addPost = () => {
    const data = {
      "title": "Hello World!",
      "body": "This is a test application"
    }
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data),
    }).then(() => Promise.resolve())
    .catch(() => Promise.reject())
}