import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
  
} from "react-native";

import DateTimePicker from 'react-native-ui-datepicker';

export default function App() {
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [directorName, setDirectorName] = useState("");
  const [dateRelease, setDateRelease] = useState();
  const [dateStarted, setDateStarted] = useState();
  const [movieBudget, setMovieBudget] = useState();
  const [editId, setEditId] = useState();
  const [search, setSearch] = useState();
  const [deletedId, setDetetedId] = useState();
  const [searchedMovie, setSearchedMovie] = useState([]);
  const [allMovies, setAllMovies] = useState([]);

  const handleChangeName = (val) => {
    setName(val);
  };
  const handleChangeGenre = (val) => {
    setGenre(val);
  };
  const handleChangeDirectorName = (val) => {
    setDirectorName(val);
  };
  const handleChangeDateRelease = (val) => {
    setDateRelease(val);
  };
  const handleChangeDateStarted = (val) => {
    setDateStarted(val);
  };
  const handleChangeMovieBudget = (val) => {
    setMovieBudget(val);
  };
  const handleChangeSearch = (val) => {
    setSearch(val);
  };

  const data = {
    name: name,
    genre: genre,
    directorName: directorName,
    dateRelease: dateRelease,
    dateStarted: dateStarted,
    movieBudget: movieBudget,
  };

  const updateData = {
    name: name,
    genre: genre,
    directorName: directorName,
    movieBudget: movieBudget,
  };


  const handleOnPress= ()=>{
    axios.post("http://192.168.254.102:3001/add-movie",data,{
      headers: {
        "Content-Type": "application/json"
      }
    }).then((res)=>{
      setName('')
      setGenre('')
      setDirectorName('')
      setMovieBudget('')
    }).catch((err)=>{
      console.log(err);
    })
  }

  const editMovie = (id) =>{
    axios.get(`http://192.168.254.102:3001/edit-movie/${id}`)
    .then((res)=>{
 
      setName(res.data.editMovie.name)
      setGenre(res.data.editMovie.genre)
      setDirectorName(res.data.editMovie.directorName)
     
      setMovieBudget(String(res.data.editMovie.movieBudget))

      setEditId(id);
    }).catch((err)=>{
      console.log(err);
    })
  }

  const updateOnPress = (id) =>{
    axios.post(`http://192.168.254.102:3001/update-movie/${id}`,updateData,{
      headers: {
        "Content-Type": "application/json"
      }
    }).then((res)=>{
      console.log(res);
    }).catch((err)=>{
      console.log(err);
    })
  }

  const deleteMovie = (id) =>{
    axios.post(`http://192.168.254.102:/delete-movie/${id}`)
    .then((res)=>{
      console.log(res);
      setDetetedId(id)
    }).catch((err)=>{
      console.log(err);
    })
  }

  const handleSearch = ()=>{
    axios.post('http://localhost:3001/search',{search: search},{
      headers: {
          "Content-Type": "application/json"
      },
    })
    .then((res)=>{
      setSearchedMovie(res.data.movieSearch)
    })
  }

  useEffect(()=>{
    axios.get('http://192.168.254.102:3001/all-movies')
    .then((res)=>{
   
      
      setAllMovies(res.data.movies)
    }).catch((err)=>{
      console.log(err);
    })
  },[data || deletedId])


  return (
    <View style={styles.container}>
      <ScrollView>
      <View>
        <Text>Name: </Text>
        <TextInput style={styles.input} value={name} onChangeText={handleChangeName} />
      </View>
      <View>
        <Text>Genre: </Text>
        <TextInput style={styles.input} value={genre} onChangeText={handleChangeGenre} />
      </View>
      <View>
        <Text>Director Name: </Text>
        <TextInput style={styles.input} value={directorName} onChangeText={handleChangeDirectorName} />
      </View>
      <View>
        <Text>Date Release: </Text>
        <DateTimePicker  value={dateRelease}
        onValueChange={handleChangeDateRelease}/>
      </View>
      <View>
        <Text>Date Started: </Text>
        <DateTimePicker value={dateStarted}
        onValueChange={handleChangeDateStarted}/>
      </View>
      <View>
        <Text>Movie Budget: </Text>
        <TextInput style={styles.input} value={movieBudget} onChangeText={handleChangeMovieBudget} />
      </View>
      
        {editId?(<Pressable onPress={()=>{updateOnPress(editId)}}>
        <Text>update</Text>
      </Pressable>):(<Pressable onPress={handleOnPress}>
        <Text>Submit</Text>
      </Pressable>)}
   

      <ScrollView>


        <View> 
           {
            allMovies.map((movie)=>{
                return( <View key={movie._id}>


                  <Text>Movie name: {movie.name} </Text>
                  <Text>Movie Genre: {movie.genre}</Text>
                  <Text>Director Name: {movie.directorName}</Text>
                  <Text>Release Date: {movie.dateRelease}</Text>
                  <Text>Date Started: {movie.dateStarted} </Text>
                  <Text>movieBudget: {movie.movieBudget}</Text>
                  
                  <Pressable onPress={()=>{
                    editMovie(movie._id)
                  }}>
                    <Text>Edit</Text>
                  </Pressable>
                  <Pressable onPress={()=>{
                    deleteMovie(movie._id)
                  }}>
                    <Text>DELETE</Text>
                  </Pressable>
               
                </View>)
              
            })
          } 
        </View>
      </ScrollView>

      <Text>Search Movie: </Text>
      <TextInput style={styles.input} onChange={handleChangeSearch}/>
      <Pressable onPress={handleSearch}>
        <Text>Search</Text>
      </Pressable>

      {searchedMovie.map((movie)=>{
        return(<View key={movie._id}>
                    <Text>Movie name: {movie.name} </Text>
                  <Text>Movie Genre: {movie.genre}</Text>
                  <Text>Director Name: {movie.directorName}</Text>
                  <Text>Release Date: {movie.dateRelease}</Text>
                  <Text>Date Started: {movie.dateStarted} </Text>
                  <Text>movieBudget: {movie.movieBudget}</Text>

        </View>)
      })}
      </ScrollView>


      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "start",
    justifyContent: "top",
    padding: 20,
    margiTop: 20,
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
