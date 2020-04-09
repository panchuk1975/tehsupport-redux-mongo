import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback
} from "react";
import { CarsComponent } from "../components/CarsComponent";
import { useHttp } from "../hooks/httpHooks";
import { AuthContext } from "../context/authContext";
import { setCarsActionCreator } from "../redux/carReduser";
import { useMessage } from "../hooks/messageHook";
import { Loader } from "../components/Loader";

export const CarsPage = ({ state }) => {
  //---------------------------Local State----------------------------//
  let cars = state.cars.cars
  if (cars) {
    localStorage.setItem("State", JSON.stringify([...cars]))
  } else {
    cars = JSON.parse(localStorage.getItem("State"))
  }
  //--------Chech windows size with  useeffect and Size State---------//
  //-----------------------------Time out-----------------------------//
  function debounce(fn, ms) {
    let timer;
    return _ => {
      clearTimeout(timer)
      timer = setTimeout(_ => {
        timer = null;
        fn.apply(this, arguments);
      }, ms)
    }
  }
  //----------------------------Size State----------------------------//
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  })
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions(
        {
          height: window.innerHeight,
          width: window.innerWidth
        },
        [dimensions]
      )
    }, 100)
    window.addEventListener("resize", debouncedHandleResize)
    return _ => {
      window.removeEventListener("resize", debouncedHandleResize)
    }
  })
  //------------------------------Use Ref-----------------------------//
  var rafID = useRef(null)
  //----------------------Use http hook for request-------------------//
  const { request, loading, error, clearError } = useHttp()
  //--------------------------Context with auth-----------------------//
  const { token } = useContext(AuthContext)
  //---------------------------Use message HOOK-----------------------//
  const message = useMessage();
  //------------------------Cars download function--------------------//
  const fetchCars = useCallback(async () => {
    try {
      const fetched = await request(`/api/car`, "GET", null, {
        Authorization: `Bearer ${token}`
      })
      rafID.current = requestAnimationFrame(fetchCars)
      setCarsActionCreator(fetched)
      message(fetched.message)
      cancelAnimationFrame(rafID.current)
    } catch (e) {}
  }, [token, request, message])
  //---------------UseEffect fo download Cars (like Mount)------------//
  useEffect(() => {
    fetchCars()
  }, [fetchCars])
  //-------------------------Error processing-------------------------//
  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])
  //----------------------Check is loading exist?---------------------//
  if (!cars || loading) {
    return <Loader />
  }
  //--------------------------------JSX-------------------------------//
  return (
    <CarsComponent
      cars={cars}
      windowWidth={window.innerWidth}
      windowHeight={window.innerHeight}
    />
  )
}
