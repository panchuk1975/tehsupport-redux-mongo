import React, {
  useState,
  useRef,
  useContext,
  useCallback,
  useEffect
} from "react";
import { NewCarsLiquidsCount } from "../helpers/newCarLiquidsCount";
import s from "../css/Route.module.css";
import { NavLink } from "react-router-dom";
import { useHttp } from "../hooks/httpHooks";
import { AuthContext } from "../context/authContext";
import { useMessage } from "../hooks/messageHook";
import { setLiquidsActionCreator } from "../redux/liquidsReduser";

export const CarLiquidsPage = ({ state }) => {
  //--------------------Get Liquids from State--------------------//
  let listLiquids = state.liquids.liquids;
  if (listLiquids) {
    const storageName = "Liquids";
    localStorage.setItem(storageName, JSON.stringify([...listLiquids]));
  } else {
    listLiquids = JSON.parse(localStorage.getItem("Liquids"));
  }
  //---------------------Get Cars from State----------------------//
  let cars = state.cars.cars;
  if (!cars) {
    cars = JSON.parse(localStorage.getItem("State"));
  }
  //--------------------Open - Clouse Session---------------------//
  var rafID = useRef(null);
  //--------------------Use http hook for request-----------------//
  const { request } = useHttp();
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
      endDate: oldDate.endDate
    };
  } else {
    initialForm = {
      firstDate: "",
      endDate: ""
    };
  }
  //-----------------------Make form for List---------------------//
  const [form, setForm] = useState({
    ...initialForm
  });
  //-------------------Count-separete liquids---------------------//
  const countListLiquids = NewCarsLiquidsCount(
    cars,
    form.firstDate,
    form.endDate
  );
  //------------------------Check is Car exist?------------------------//
  localStorage.setItem(
    "Date",
    JSON.stringify({
      ...form
    })
  );
  //----------------------Textarea activation---------------------//
  useEffect(() => {
    window.M.updateTextFields();
  }, []);
  //---------------------Event change Handler---------------------//
  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  //-------------------Liquids download function------------------//
  const fetchLiquids = useCallback(async () => {
    try {
      const fetched = await request(`/api/liquids`, "GET", null, {
        Authorization: `Bearer ${token}`
      });
      rafID.current = requestAnimationFrame(fetchLiquids);
      setLiquidsActionCreator(fetched);
      message(fetched.message);
      cancelAnimationFrame(rafID.current);
    } catch (e) {}
  }, [token, request, message]);
  //------------UseEffect fo fetchLinks (like Mount)--------------//
  useEffect(() => {
    rafID.current = requestAnimationFrame(fetchLiquids);
    fetchLiquids();
    cancelAnimationFrame(rafID.current);
  }, [fetchLiquids]);
  //------------------------------JSX--------------------------------//
  return (
    <div>
      <div className="row">
        <form className="col s12">
          <div
            className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
            style={{ marginBottom: 3, marginTop: 8 }}
          >
            Період розрахунку:
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
            Розрахунок ПММ в кг:
          </div>
        </form>
        {listLiquids && (
          <form className="col s12">
            <div className={s.liquidTitle}>
              <div className={s.item}>Назва</div>
              <div className={s.item}>Було</div>
              <div className={s.item}>Надійшло</div>
              <div className={s.item}>Вибуло</div>
              <div className={s.item}>Разом</div>
              <div className={s.item}>Щільність</div>
            </div>
            {listLiquids &&
              listLiquids.map(liquid => {
                return (
                  <div key={liquid.name}>
                    <NavLink to={`/liq/${liquid._id}`}>
                      <div className={s.liquid}>
                        <div className={s.item}>{`${liquid.name}`}</div>
                        <div className={s.item}>{`${Math.round(
                          liquid.balanceStart * liquid.density
                        )}`}</div>
                        <div className={s.item}>{`${Math.round(
                          liquid.received * liquid.density
                        )}`}</div>
                        <div className={s.item}>{`${Math.round(
                          liquid.expended * liquid.density
                        )}`}</div>
                        <div className={s.item}>{`${Math.round(
                          liquid.balanceFinish * liquid.density
                        )}`}</div>
                        <div className={s.item}>{`${liquid.density}`}</div>
                      </div>
                    </NavLink>
                  </div>
                );
              })}
          </form>
        )}
        <form className="col s12">
          <div
            className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
            style={{ marginBottom: 3, marginTop: 8 }}
          >
            ПММ в л, визначте поточну щільність :
          </div>
        </form>
        {countListLiquids && (
          <form className="col s12">
            <div className={s.liquidTitle}>
              <div className={s.item}>Назва</div>
              <div className={s.item}>Було</div>
              <div className={s.item}>Надійшло</div>
              <div className={s.item}>Вибуло</div>
              <div className={s.item}>Разом</div>
              <div className={s.item}>Щільність</div>
            </div>
            {countListLiquids &&
              countListLiquids.map(liquid => {
                liquid.name = liquid.name.replace(/\s/g, '');
                return (
                  <div key={liquid.name}>
                    <NavLink to={`/liq/${liquid.name}`}>
                      <div className={s.liquid}>
                        <div className={s.item}>{`${liquid.name}`}</div>
                        <div className={s.item}>{`${liquid.balanceStart}`}</div>
                        <div className={s.item}>{`${liquid.received}`}</div>
                        <div className={s.item}>{`${liquid.expended}`}</div>
                        <div
                          className={s.item}
                        >{`${liquid.balanceFinish}`}</div>
                        <div className={s.item}>{`${liquid.density}`}</div>
                      </div>
                    </NavLink>
                  </div>
                );
              })}
          </form>
        )}
      </div>
    </div>
  );
};
