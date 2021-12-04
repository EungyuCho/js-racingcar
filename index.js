(() => {
  // src/ts/utils/dom.ts
  var $ = ({ selector, type = "ID" }) => {
    if (type === "ID") {
      return document.querySelector("#" + selector);
    }
    if (type === "CLASSNAME") {
      return document.querySelector("." + selector);
    }
    return document.querySelector(selector);
  };

  // src/ts/constants/ErrorMessage.ts
  var NAME_LENGTH_INVALID_ERROR = "\uC790\uB3D9\uCC28\uC758 \uC774\uB984\uC740 \uD55C\uAE00\uC790 ~ 5\uAE00\uC790 \uC0AC\uC774\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4.";
  var GAME_COUNT_INVALID_ERROR = "\uAC8C\uC784\uD69F\uC218\uB294 1\uC774\uC0C1\uC73C\uB85C \uC785\uB825\uD574\uC8FC\uC138\uC694.";
  var ERROR_MESSAGES = Object.freeze({
    NAME_LENGTH_INVALID_ERROR,
    GAME_COUNT_INVALID_ERROR
  });
  var ErrorMessage_default = ERROR_MESSAGES;

  // src/ts/utils/random.ts
  var getRamdomNumber = ({ min, max }) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // src/ts/model/car.model.ts
  var Car = class {
    name;
    #progressDistance;
    #targetCount;
    #viewContiner;
    #RoadElement;
    constructor(name) {
      this.name = name;
      this.#progressDistance = 0;
      this.#targetCount = 0;
      this.#viewContiner = ViewComponents.RacingContainer;
    }
    move(currentCount) {
      const isProgress = this.isProgress();
      if (isProgress) {
        this.#progressDistance += 1;
        this.renderProgressArrow();
      }
      if (this.isGameEnded(currentCount)) {
        const arrowElement = this.#RoadElement.querySelector(".d-flex");
        arrowElement.remove();
      }
    }
    createContainer() {
      const RoadElement = document.createElement("div");
      RoadElement.classList.add("mr-2");
      RoadElement.innerHTML = `
      <div class="car-player">${this.name}</div>
      <div class="d-flex justify-center mt-3">
        <div class="relative spinner-container">
          <span class="material spinner"></span>
        </div>
      </div>
    `;
      this.#RoadElement = RoadElement;
    }
    renderRoad() {
      this.createContainer();
      this.#viewContiner.insertAdjacentElement("beforeend", this.#RoadElement);
    }
    renderProgressArrow() {
      const arrowElement = this.#RoadElement.querySelector(".d-flex");
      arrowElement.outerHTML = `
      <div class="forward-icon mt-2">\u2B07\uFE0F\uFE0F</div>
      <div class="d-flex justify-center mt-3">
          <div class="relative spinner-container">
            <span class="material spinner"></span>
          </div>
        </div>
    `;
    }
    set targetCount(count) {
      this.#targetCount = count;
    }
    isGameEnded(currentCount) {
      return this.#targetCount === currentCount;
    }
    isProgress() {
      return getRamdomNumber({ min: 0, max: 9 }) >= 4;
    }
    get moveDistance() {
      return this.#progressDistance;
    }
  };
  var car_model_default = Car;

  // src/ts/view/Racing.state.ts
  var initialState = {
    _t: "idle",
    cars: [],
    gameCount: null
  };
  function splitCarNames(carNames) {
    return carNames.split(",").map((name) => name.trim());
  }
  function getCars(carNames) {
    const cars = [];
    const carNameArray = splitCarNames(carNames);
    for (const carName of carNameArray) {
      if (carName.length > 5 || !carName.length) {
        throw new Error(ErrorMessage_default.NAME_LENGTH_INVALID_ERROR);
      }
      cars.push(new car_model_default(carName));
    }
    return cars;
  }
  function isGameCountValid(count) {
    return count > 0;
  }
  function getGameCount(count) {
    if (!isGameCountValid(count)) {
      throw new Error(ErrorMessage_default.GAME_COUNT_INVALID_ERROR);
    }
    return count;
  }
  function reducer(prevState, action) {
    switch (action._t) {
      case "SET_IDLE":
        return {
          ...initialState
        };
      case "INSERT_CARS":
        return {
          ...prevState,
          _t: "insert_cars",
          cars: getCars(action.carNames)
        };
      case "INSERT_GAME_COUNT":
        return {
          _t: "insert_game_count",
          cars: prevState.cars,
          gameCount: getGameCount(action.gameCount)
        };
      case "SET_WINNER":
        return {
          ...prevState,
          _t: "set_winner",
          winners: action.winners
        };
    }
  }
  function makeState(initialState2) {
    const state = {
      ...initialState2
    };
    return {
      state,
      dispatch(action) {
        Object.assign(state, reducer(state, action));
      }
    };
  }

  // src/ts/view/Racing.view.ts
  var css = String.raw;
  var setStyle = (state) => {
    const {
      GameCountFieldset,
      RacingRoadSection,
      WinnerSection,
      CarNameButton,
      GameCountInput,
      GameCountButton,
      CarNameInput
    } = ViewComponents;
    switch (state._t) {
      case "idle":
        GameCountFieldset.style.cssText = css`
        display: none;
      `;
        RacingRoadSection.style.cssText = css`
        display: none;
      `;
        WinnerSection.style.cssText = css`
        display: none;
      `;
        CarNameInput.disabled = false;
        CarNameButton.disabled = false;
        GameCountInput.disabled = false;
        GameCountButton.disabled = false;
        return;
      case "insert_cars":
        GameCountFieldset.style.cssText = css`
        display: block;
      `;
        CarNameInput.disabled = true;
        CarNameButton.disabled = true;
        return;
      case "insert_game_count":
        RacingRoadSection.style.cssText = css`
        display: flex;
      `;
        GameCountInput.disabled = true;
        GameCountButton.disabled = true;
        return;
      case "set_winner":
        WinnerSection.style.cssText = css`
        display: flex;
      `;
        return;
    }
  };

  // src/ts/controller/racing.controller.ts
  var ViewComponents = {
    GameCountFieldset: $({ selector: "game-count-fieldset", type: "CLASSNAME" }),
    CarNameFieldset: $({ selector: "car-name-fieldset", type: "CLASSNAME" }),
    RacingRoadSection: $({ selector: "racing-road-section", type: "CLASSNAME" }),
    WinnerSection: $({ selector: "winner-section", type: "CLASSNAME" }),
    CarNameInput: $({ selector: "car_name_input" }),
    CarNameButton: $({ selector: "car_name_button" }),
    GameCountInput: $({ selector: "game_count_input" }),
    GameCountButton: $({ selector: "game_count_button" }),
    ResetButton: $({ selector: "reset_button" }),
    RacingContainer: $({ selector: "racing-road-container" }),
    WinnerLabel: $({ selector: "winner_label" })
  };
  var RacingController = class {
    currentProgressCount;
    state;
    dispatch;
    constructor() {
      const { state, dispatch } = makeState({
        _t: "idle",
        cars: [],
        gameCount: null
      });
      this.currentProgressCount = 0;
      this.state = state;
      this.dispatch = dispatch;
      setStyle(state);
      this.setEvent();
    }
    setEvent() {
      const {
        CarNameInput,
        CarNameButton,
        GameCountInput,
        GameCountButton,
        WinnerSection,
        RacingContainer
      } = ViewComponents;
      const dispatchInsertCars = () => this.dispatchEvent({
        makeAction: () => {
          return {
            _t: "INSERT_CARS",
            carNames: CarNameInput.value
          };
        },
        onError: () => {
          CarNameInput.value = "";
          CarNameInput.focus();
        },
        onEventEnd: () => {
          GameCountInput.focus();
        }
      });
      const dispatchInsertGameCount = () => this.dispatchEvent({
        makeAction: () => {
          return {
            _t: "INSERT_GAME_COUNT",
            gameCount: Number(GameCountInput.value)
          };
        },
        onEventEnd: () => this.startGame(),
        onError: () => {
          GameCountInput.value = "";
          GameCountInput.focus();
        }
      });
      const dispatchResetGame = () => this.dispatchEvent({
        makeAction: () => {
          return {
            _t: "SET_IDLE"
          };
        },
        onEventEnd: () => {
          this.currentProgressCount = 0;
          CarNameInput.value = "";
          GameCountInput.value = "";
          RacingContainer.innerHTML = "";
          CarNameInput.focus();
        }
      });
      const isPressEnter = (event) => event.key === "Enter";
      CarNameButton.addEventListener("click", () => dispatchInsertCars());
      GameCountButton.addEventListener("click", () => dispatchInsertGameCount());
      WinnerSection.addEventListener("click", () => dispatchResetGame());
      CarNameInput.addEventListener("keypress", (event) => {
        if (isPressEnter(event)) {
          dispatchInsertCars();
        }
      });
      GameCountInput.addEventListener("keypress", (event) => {
        if (isPressEnter(event)) {
          dispatchInsertGameCount();
        }
      });
    }
    dispatchEvent({
      makeAction,
      onEventEnd = () => {
      },
      onError = () => {
      }
    }) {
      try {
        this.dispatch(makeAction());
        setStyle(this.state);
        onEventEnd();
      } catch (error) {
        onError();
        alert(error.message);
      }
    }
    resetGame() {
      this.dispatch({ _t: "SET_IDLE" });
    }
    startGame() {
      this.state.cars.forEach((car) => {
        car.targetCount = this.state.gameCount || 0;
        car.renderRoad();
      });
      const animate = () => {
        this.currentProgressCount += 1;
        this.state.cars.forEach((car) => car.move(this.currentProgressCount));
        if (this.currentProgressCount < (this.state.gameCount || 0)) {
          requestAnimationFrame(() => {
            setTimeout(() => animate(), 1e3);
          });
          return;
        }
        let maxMovementDistance = -1;
        const winners = this.state.cars.map((car) => {
          if (maxMovementDistance < car.moveDistance) {
            maxMovementDistance = car.moveDistance;
          }
          return { name: car.name, move: car.moveDistance };
        }).filter((car) => car.move === maxMovementDistance).map((car) => car.name);
        this.dispatchEvent({
          makeAction: () => ({ _t: "SET_WINNER", winners }),
          onEventEnd: () => {
            ViewComponents.WinnerLabel.textContent = `\u{1F3C6} \uCD5C\uC885 \uC6B0\uC2B9\uC790: ${winners.join(", ")} \u{1F3C6}`;
            ViewComponents.WinnerLabel.dataset.winners = winners.join(", ");
          }
        });
      };
      animate();
    }
  };
  var racing_controller_default = RacingController;

  // src/ts/index.ts
  new racing_controller_default();
})();
