import React, {
  useState,
  useRef,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { useHttp } from "../hooks/httpHooks";
import { AuthContext } from "../context/authContext";
import { useMessage } from "../hooks/messageHook";
import { setCarsActionCreator } from "../redux/carReduser";
import { Loader } from "../components/Loader";
import { StatisticCarLists } from "../components/StatisticCarLists";

export const CarRowsPage = ({ state }) => {
  //---------------------Get Cars from State----------------------//
  let cars = state.cars.cars;
  if (!cars) {
    cars = JSON.parse(localStorage.getItem("State"));
  }
  //--------------------Open - Clouse Session---------------------//
  var rafID = useRef(null);
  //--------------------Use http hook for request-----------------//
  const { request, loading } = useHttp();
  //------------------------Context with auth---------------------//
  const { token } = useContext(AuthContext);
  //-------------------------Use message HOOK---------------------//
  const message = useMessage();
  //-----------------Get valid Car from Local Storage------------------//
  const oldDate = JSON.parse(localStorage.getItem("Date"));
  //------------------------------Get Date------------------------//
  let initialForm = {};
  if (oldDate) {
    initialForm = {
      firstDate: oldDate.firstDate,
      endDate: oldDate.endDate,
    };
  } else {
    initialForm = {
      firstDate: "",
      endDate: "",
    };
  }
  //-----------------------Make form for List---------------------//
  const [form, setForm] = useState({
    ...initialForm,
  });
  //------------------------Check is Car exist?------------------------//
  localStorage.setItem(
    "Date",
    JSON.stringify({
      ...form,
    })
  );
  //----------------------Textarea activation---------------------//
  useEffect(() => {
    window.M.updateTextFields();
  }, []);
  //---------------------Event change Handler---------------------//
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  //-------------------Liquids download function------------------//
  const fetchCars = useCallback(async () => {
    try {
      const fetched = await request(`/api/car`, "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      rafID.current = requestAnimationFrame(fetchCars);
      setCarsActionCreator(fetched);
      message(fetched.message);
      cancelAnimationFrame(rafID.current);
    } catch (e) {}
  }, [token, request, message]);
  //------------UseEffect fo fetchLinks (like Mount)--------------//
  useEffect(() => {
    rafID.current = requestAnimationFrame(fetchCars);
    fetchCars();
    cancelAnimationFrame(rafID.current);
  }, [fetchCars]);
  //--------Chech windows size with  useeffect and Size State---------//
  //-----------------------------Time out------------------------------//
  function debounce(fn, ms) {
    let timer;
    return (_) => {
      clearTimeout(timer);
      timer = setTimeout((_) => {
        timer = null;
        fn.apply(this, arguments);
      }, ms);
    };
  }
  //----------------------------Size State-------------------------------//
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions(
        {
          height: window.innerHeight,
          width: window.innerWidth,
        },
        [dimensions]
      );
    }, 100);
    window.addEventListener("resize", debouncedHandleResize);
    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });
  cars.sort((a, b) => a.governmentCarNumber > b.governmentCarNumber ? 1 : -1);
  //-----------------------Check is loading exist?---------------------//
  if (!cars || loading) {
    return <Loader />;
  }
  //------------------------------JSX--------------------------------//
  return (
    <div>
      <div className="row">
        <form className="col s12">
          <div
            className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
            style={{ marginBottom: 3, marginTop: 8 }}
          >
            Період:
          </div>
        </form>
        <form className="col s12">
          <div className="col s12 grey lighten-2">
            <div className="col s5 offset-s1  input-field">
              <input
                placeholder="Початкова дата"
                id="firstDate"
                type="date"
                name="firstDate"
                value={form.firstDate}
                onChange={changeHandler}
                required
              />
              <label htmlFor="firstDate">Початкова дата</label>
            </div>
            <div className="col s5 offset-s0  input-field">
              <input
                placeholder="Кінцева дата"
                id="endDate"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={changeHandler}
                required
              />
              <label htmlFor="endDate">Кінцева дата</label>
            </div>
          </div>
        </form>
        <form className="col s12">
          <div
            className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
            style={{ marginBottom: 3, marginTop: 8 }}
          >
            Задіяні авто :
          </div>
        </form>
        {cars && (
          <form className="col s12">
            {cars &&
              cars.map((car) => (
                <div key={car._id}>
                  <div
                    className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
                    style={{ marginBottom: 1, marginTop: 6 }}
                  >
                    {car.governmentCarNumber}
                  </div>
                  {car && (
                    <StatisticCarLists
                      carLists={car.carLists}
                      firstDate={form.firstDate}
                      endDate={form.endDate}
                    />
                  )}
                </div>
              ))}
          </form>
        )}
      </div>
    </div>
  );
};
