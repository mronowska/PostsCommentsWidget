const input = document.getElementById('input');
const container = document.getElementById('container');
const btnShow = document.getElementById('showBtn');
const btnSearch = document.getElementById('searchBtn');
const btnRestart = document.getElementById('restartBtn');

btnShow.style.display = 'none';

let posts = fetch('https://jsonplaceholder.typicode.com/posts');
let comments = fetch('https://jsonplaceholder.typicode.com/comments');

Promise.all([posts, comments])
.then(values => Promise.all(values.map(value => value.json())))
.then(finalVals => {
  let posts = finalVals[0];
  let comments = finalVals[1];
  btnSearch.addEventListener('click', () => search(input.value, posts, comments));
})
	.catch(function (error) {
		// if there's an error, log it
		console.log(error);
	});

const restart = () => {
  input.value = '';
  history.go(0);
}

function search(searchText, posts, comments) {
   let matches = posts.filter(posts => {
   const regex = new RegExp(`^${searchText}`, 'gi');
   return posts.title.match(regex);
  });

  if (searchText.length === 0) {
    matches = [];
  }

  printMatches(matches);

  btnShow.addEventListener('click', function() { addComment(matches, comments) });
}

const printMatches = matches => {
  if(matches.length > 0) {
    const html = matches.map(match => `
        <div class="post">
          <h4 class="post-title">${match.title}</h4>
          <p class="post-content">${match.body}</p>
          <div class="comment"></div>
      </div>
      `
    )
    .join('');

    container.innerHTML = html;
    btnShow.style.display = 'block';
  }
}

function addComment (matches, comments) {
   for (let i = 0; i < (matches.length); i++){
     for(let j = 0; j < comments.length; j++){
        const commentDiv = document.getElementsByClassName('comment')[i];
        const commentName = document.createElement('p');
        const commentEmail = document.createElement('h5');
        const commentBody = document.createElement('p');

        if(matches[i].id == comments[j].postId) {
          commentDiv.appendChild(commentName).classList = "comment-name";
          commentDiv.appendChild(commentEmail).classList = "comment-email";
          commentDiv.appendChild(commentBody).classList = "comment-body";
          commentDiv.appendChild(commentName).innerHTML = `${comments[j].name}`;
          commentDiv.appendChild(commentEmail).innerHTML = `${comments[j].email}`;
          commentDiv.appendChild(commentBody).innerHTML = `${comments[j].body}`;
        }
     }
  }
}

btnRestart.addEventListener('click', function() { restart()});
