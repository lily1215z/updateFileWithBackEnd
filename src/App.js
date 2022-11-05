import './App.css';
import axios from "axios";

//https://www.youtube.com/watch?v=sIQEcYA1YTQ&list=PLbLBXDhswD1eZCz4ZQDBNCAuvuDO6h4yT&index=27&t=1s  урок 16


const api = {
    //метод для загрузки на ПК файл
    getFile() {
        // return axios.get('http://localhost:8000/file').then(res => res.data)
        return axios.get('http://localhost:8000/file', {responseType: 'blob'}).then(res => res.data)
    },

    //метод для загрузки файла с ПК на бэк. Могут попросить отправить formData или просто body (file)
    loadFile(file) {
        return axios.post('http://localhost:8000/file', file)
    }
}


function App() {

    //ф-я чтоб при клике, сервер загрузил на ПК файл
    const onClickHandler = async (e) => {
        const res = await api.getFile()
        loadWithUrl(res)
        // loadWithBase64(res)
    }

    //ф-я чтоб при клике выбрать с ПК файл и загрузить на бэк
    const onChangeHandler = async (e) => {
        const file = e.currentTarget.files[0]

        //await api.loadFile(file)          //если просят просто передать тело(файл) не formData то просто закидываем в АПИ

        //если просят передать не просто тело а formData, и передать уже ее
        const formData = new FormData()
        formData.append('file', file)
        //данные кот я собиру через формик или реактХукФорм тоже закидываю в append. Можно не руками а циклом это сделать
        formData.append('fileName', "Alex")

        await api.loadFile(formData)

        //случай когда нужно что-то вычитать из файла - почти не используется
        const fileReader = new FileReader()
        fileReader.readAsText(file, 'utf-8')  //utf-8 для кирилицы
        fileReader.onload = function () {
            console.log(fileReader.result)
        }
    }

    return (
        <div className="App">
            <button onClick={onClickHandler}>load file</button>
            <input onChange={onChangeHandler} type='file' />
        </div>
    );
}

export default App;

const loadWithUrl = (content) => {
     // если в АПИ использовать эту строку return axios.get('http://localhost:8000/file', {responseType: 'blob'}).then(res => res.data)
    // то строку ниже можно удалить а в след передать не blob a content
    // const blob = new Blob([content])

    const url = URL.createObjectURL(content)

    const a = document.createElement("a")

    a.href = url
    a.download = "hello.txt"
    a.style = "display: none;"

    document.body.appendChild(a)

    a.click()
    a.remove()

    console.log(url)  //we can see in console create url

    URL.revokeObjectURL(url)   //удаляем(чистим) после загрузки ссылку
}


// Second variant - лучше пользоваться первым вариантом т.к. этот нужно еще кодировать
const loadWithBase64 = (content) => {

    const reader = new FileReader()

    reader.readAsDataURL(content)

    reader.onload = function () {
        let url = reader.result
        const a = document.createElement("a")

        a.href = url
        a.download = "hello.txt"
        a.style = "display: none;"

        document.body.appendChild(a)

        a.click()
        a.remove()

        console.log(url)  //we can see in console create url

        URL.revokeObjectURL(url)
    }
}