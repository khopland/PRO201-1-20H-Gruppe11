<template>
  <div class="container">
    <h1>Add new Camp</h1>
    <form @submit.prevent="submit">
      <div class="wrapper">
        <div class="input">
          <label>Camp name: </label>
          <input
            v-model="name"
            type="text"
            placeholder="Enter Camp name"
            required
          />
        </div>
        <div class="input">
          <label>Country: </label>
          <input
            v-model="Country"
            type="text"
            placeholder="Enter Country"
            required
          />
        </div>
        <div class="input">
          <label>Coordinates: </label>
          <input
            v-model="geo"
            type="text"
            placeholder="Enter Coordinates"
            required
          />
          <span>
            <i
              >Input Coordinate Format: &emsp; 0.00,0.00 (latitude,
              longitude)</i
            ><br />
            <a href="http://geojson.io/">Map Tool Link</a>
          </span>
          <span v-if="error !== null">
            <i>{{ error }}</i>
          </span>
        </div>
        <div>
          <button id="submit-btn" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from "vue";
import { post } from "axios";

export default {
  name: "CampAdministrationPage",
  setup() {
    const { ctx: _this } = getCurrentInstance();
    const name = ref("");
    const Country = ref("");
    const geo = ref("");
    const error = ref(null);

    const showToast = () => {
      _this.$toast.success(`Camp created`, {
        position: "bottom"
      });
    };
    const submit = async () => {
      const location = geo.value.split(",");
      error.value = null;
      try {
        await post(
          `${process.env.VUE_APP_SERVER_URL}/api/camp`,
          {
            name: name.value,
            Country: Country.value,
            coordinates: [parseFloat(location[0]), parseFloat(location[1])]
          },
          { withCredentials: true }
        );
        name.value = "";
        Country.value = "";
        geo.value = "";
        showToast();
      } catch (e) {
        error.value = "something went wrong";
      }
    };

    return {
      name,
      Country,
      geo,
      submit,
      error
    };
  }
};
</script>

<style lang="scss" scoped>
a {
  color: #4aae9b;
  text-decoration: underline;
}

a:hover {
  color: lightblue;
  text-decoration: underline;
}

.container {
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
  max-width: 100%;
  height: 100%;

  @import url("https://fonts.googleapis.com/css2?family=Open+Sans&display=swap");

  h1 {
    margin-top: 7vh;
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 20px;
    font-family: "Open Sans", sans-serif;
    color: #828b96;
  }

  @import url("https://fonts.googleapis.com/css2?family=Open+Sans&display=swap");

  .section-item-text {
    font-size: 0.7em;
    text-align: center;
    font-family: "Open Sans", sans-serif;
    font-style: italic;
    color: #828b96;
  }

  .wrapper {
    background: #2c2a29;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin-bottom: 50px;
    width: 100%;
    border-radius: 5px;
    box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.02),
      0 6.7px 5.3px rgba(0, 0, 0, 0.028), 0 12.5px 10px rgba(0, 0, 0, 0.035),
      0 22.3px 17.9px rgba(0, 0, 0, 0.042), 0 41.8px 33.4px rgba(0, 0, 0, 0.05),
      0 100px 80px rgba(0, 0, 0, 0.07), -2px -3px #899599;

    .input {
      margin-bottom: 1vh;
      width: 500px;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: center;

      label {
        color: #a8d598;
        font-weight: bold;
        width: 200px;
      }

      input {
        width: 300px;
        padding: 0.4em;
        box-shadow: inset -2px -2px #899599;
        outline: none;
        color: #2c2a29;
        font-weight: bold;
        background: #cdcdcd;

        &::placeholder {
          color: #6d6d6d;
        }
      }

      span {
        width: 100%;
        font-size: 14px;
        font-weight: bold;
        color: #cdcdcd;
        margin: 10px 0;
      }
    }

    #submit-btn {
      margin-top: 50px;
      background-color: #ececec;
      color: #2c2a29;
      width: 100%;
      padding: 0.5rem;
      border-radius: 5px;
      box-shadow: -1px -2px #899599;
      outline: none;
      transition: 150ms;
      font-weight: bold;

      &:hover {
        background-color: #4d5050;
        color: #ececec;
      }

      &:active {
        transform: scale(0.98);
        transition-duration: 10ms;
        box-shadow: inset 2px 2px 2px #899599;
        background-color: #6d6d6d;
      }
    }
  }
}
</style>
