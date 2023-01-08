import { useState, useEffect, useRef } from "react";
import Add from "@material-ui/icons/Add";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";

import Home from "@arcgis/core/widgets/Home";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle";

import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

//Icons
import requestInfoIcon from "../../Images/request.png";
import add from "../../Images/addition.png";
import others from "../../Images/others.png";
import missedServive from "../../Images/missed-servive.png";
import complain from "../../Images/complain.png";

//styles
import "./Feedbacks.css";

export default function Feedbacks() {
  /*   =================states================= */
  const [feedbackData, setFeedbackData] = useState({
    Name: "",
    Email: "",
    Type: "",
    Message: "",
  });
  const [feedbacks, setFeedbacks] = useState([
    {
      ID: 1,
      Name: "Amira",
      Email: "amira.mohamed@gmail.com",
      Type: "Add Information",
      Message: "Add Message",
      x: 31.477898,
      y: 30.005493,
    },
    {
      ID: 2,
      Name: "Eman",
      Email: "eman.mohamed@gmail.com",
      Type: "Request Information",
      Message: "Request Message",
      x: 32.477898,
      y: 31.005493,
    },
    {
      ID: 3,
      Name: "Asmaa",
      Email: "asmaa.mohamed@gmail.com",
      Type: "others",
      Message: "Request Message",
      x: 33.477898,
      y: 32.005493,
    },
    {
      ID: 4,
      Name: "Ahlam",
      Email: "ahlam.mohamed@gmail.com",
      Type: "Missed Servive",
      Message: "Request Message",
      x: 29.477898,
      y: 28.005493,
    },

    {
      ID: 5,
      Name: "Aml",
      Email: "aml.mohamed@gmail.com",
      Type: "complain",
      Message: "Request Message",
      x: 28.477898,
      y: 27.005493,
    },
  ]);

  const [feedbacksAttributes, setFeedbacksAttributes] = useState([
    {
      ID: 1,
      Name: "Amira",
      Email: "amira.mohamed@gmail.com",
      Type: "Add Information",
      Message: "Add Message",
      x: 31.477898,
      y: 30.005493,
    },
    {
      ID: 2,
      Name: "Eman",
      Email: "eman.mohamed@gmail.com",
      Type: "Request Information",
      Message: "Request Message",
      x: 32.477898,
      y: 31.005493,
    },
    {
      ID: 3,
      Name: "Asmaa",
      Email: "asmaa.mohamed@gmail.com",
      Type: "others",
      Message: "Request Message",
      x: 33.477898,
      y: 32.005493,
    },
    {
      ID: 4,
      Name: "Ahlam",
      Email: "ahlam.mohamed@gmail.com",
      Type: "Missed Servive",
      Message: "Request Message",
      x: 29.477898,
      y: 28.005493,
    },

    {
      ID: 5,
      Name: "Aml",
      Email: "aml.mohamed@gmail.com",
      Type: "complain",
      Message: "Request Message",
      x: 28.477898,
      y: 27.005493,
    },
  ]);

  const [feedbacksTypes] = useState([
    "complain",
    "Request Information",
    "Add Information",
    "Missed Servive",
    "others",
  ]);
  const [reportFeedback, setReportFeedback] = useState(false);

  const [currentFeed, setCurrentFeed] = useState({
    id: null,
    x: null,
    y: null,
  });

  /*   =================Dom Nodes================= */
  const MapElement = useRef(null);

  /*   =================Styles Variable================= */
  const feedbackBtn = {
    position: "absolute",
    left: "15px",
    top: "130px",
    zIndex: 9999999,
  };

  const submitFeedback = (e, data) => {
    e.preventDefault();
    setFeedbacks((feedbacks) => [
      ...feedbacks,
      {
        ID: currentFeed.id,
        Name: feedbackData.Name,
        Email: feedbackData.Email,
        Type: feedbackData.Type,
        Message: feedbackData.Message,
        x: currentFeed.x,
        y: currentFeed.y,
      },
    ]);
    setFeedbacksAttributes((fbAttr) => [
      ...fbAttr,
      {
        ID: currentFeed.id,
        Name: feedbackData.Name,
        Email: feedbackData.Email,
        Type: feedbackData.Type,
        Message: feedbackData.Message,
        x: currentFeed.x,
        y: currentFeed.y,
      },
    ]);
    setReportFeedback(false);
    setFeedbackData({
      Name: "",
      Email: "",
      Type: "",
      Message: "",
    });
    document.getElementById("feedbackForm").style.display = "none";
  };
  useEffect(() => {
    var view = new MapView({
      container: MapElement.current,
      map: new Map({
        basemap: "satellite",
      }),

      zoom: 10,
      center: [31.477898, 30.005493],
    });

    const homeBtn = new Home({
      view: view,
    });
    view.ui.add(homeBtn, "top-left");

    let scaleBar = new ScaleBar({
      view: view,
      style: "ruler",
    });
    // Add widget to the bottom left corner of the view
    view.ui.add(scaleBar, {
      position: "bottom-left",
    });

    const toggle = new BasemapToggle({
      // 2 - Set properties
      view: view, // view that provides access to the map's 'topo-vector' basemap
      nextBasemap: "dark-gray", // allows for toggling to the 'hybrid' basemap
    });

    // Add widget to the top right corner of the view
    view.ui.add(toggle, "top-right");

    let graphicsLayerIcon;
    feedbacks.map((feedack) => {
      if (feedack.Type === "Request Information") {
        graphicsLayerIcon = requestInfoIcon;
      } else if (feedack.Type === "Add Information") {
        graphicsLayerIcon = add;
      } else if (feedack.Type === "others") {
        graphicsLayerIcon = others;
      } else if (feedack.Type === "Missed Servive") {
        graphicsLayerIcon = missedServive;
      } else if (feedack.Type === "complain") {
        graphicsLayerIcon = complain;
      }

      const feedbackPoint = {
        type: "point", // autocasts as new Point()
        x: feedack.x,
        y: feedack.y,
      };
      //symbology
      const feedbackMarkerSymbol = {
        type: "picture-marker", // autocasts as new PictureMarkerSymbol()
        url: graphicsLayerIcon,
        width: "20px",
        height: "20px",
      };
      //attributes
      const feedbackPointAtt = {
        ID: Math.random(),
        Name: feedack.Name,
        Email: feedack.Email,
        Type: feedack.Type,
        Message: feedack.Message,
        x: feedack.x,
        y: feedack.y,
      };
      const usersFeedbacksPointGraphic = new Graphic({
        geometry: feedbackPoint,
        symbol: feedbackMarkerSymbol,
        attributes: feedbackPointAtt,
        popupTemplate: {
          // autocasts as new PopupTemplate()
          title: "Feedback Data",
          content: [
            {
              type: "fields",
              fieldInfos: [
                {
                  fieldName: "ID",
                },
                {
                  fieldName: "Name",
                },
                {
                  fieldName: "Email",
                },
                {
                  fieldName: "Type",
                },
                {
                  fieldName: "Message",
                },
                {
                  fieldName: "x",
                },
                {
                  fieldName: "y",
                },
              ],
            },
          ],
        },
      });
      const layer = new FeatureLayer({
        source: view.graphics.add(usersFeedbacksPointGraphic),
        fields: [
          {
            name: "ID",
            alias: "ID",
            type: "oid",
          },
          {
            name: "Name",
            alias: "Name",
            type: "string",
          },
          {
            name: "Type",
            alias: "Type",
            type: "string",
          },
          {
            name: "Message",
            alias: "Message",
            type: "string",
          },
        ],
        objectIdField: "ID",
        geometryType: "point",
      });
    });

    view.on("click", function (event) {
      const fbID = Math.random();

      if (reportFeedback) {
        document.getElementById("feedbackForm").style.display = "block";

        setCurrentFeed({
          id: fbID,
          x: Math.round(event.mapPoint.longitude * 1000) / 1000,
          y: Math.round(event.mapPoint.latitude * 1000) / 1000,
        });
      }
    });
  }, [feedbacks, reportFeedback]);

  return (
    <>
      <button
        title="Add Your Feedback"
        style={feedbackBtn}
        onClick={() => setReportFeedback(true)}
      >
        <Add />
      </button>

      <div
        id="feedbackForm"
        style={{
          backgroundColor: "white",
          position: "absolute",
          zIndex: 99999,
          display: "block",
          margin: "50px 100px",
          padding: "20px",
          display: "none",
        }}
      >
        <div className="fw-bold">User Feedback data</div>

        <form onSubmit={submitFeedback} className="d-flex flex-column">
          <input
            className="form-control my-2"
            type="text"
            name="Name"
            value={feedbackData.Name}
            placeholder="Name"
            onChange={(e) => {
              e.preventDefault();
              setFeedbackData((feedackData) => {
                return {
                  ...feedackData,
                  Name: e.target.value,
                };
              });
            }}
          />

          <input
            className="form-control my-2"
            type="email"
            name="Email"
            value={feedbackData.Email}
            placeholder="Email"
            onChange={(e) => {
              e.preventDefault();
              setFeedbackData((feedackData) => {
                return {
                  ...feedackData,
                  Email: e.target.value,
                };
              });
            }}
          />

          <select
            className="form-control my-2"
            name="Type"
            value={feedbackData.Type}
            placeholder="Choose"
            onChange={(e) => {
              setFeedbackData((feedackData) => {
                return {
                  ...feedackData,
                  Type: e.target.value,
                };
              });
            }}
          >
            {feedbacksTypes.map((feedbackType) => {
              return <option key={Math.random()}>{feedbackType}</option>;
            })}
          </select>
          <input
            className="form-control my-2"
            type="text"
            name="Message"
            value={feedbackData.Message}
            placeholder="Message"
            onChange={(e) => {
              e.preventDefault();
              setFeedbackData((feedackData) => {
                return {
                  ...feedackData,
                  Message: e.target.value,
                };
              });
            }}
          />

          <button className="btn btn-secondary" type="submit">
            submit
          </button>
        </form>
      </div>

      <div style={{ height: "100%" }} ref={MapElement}>
        <div className="container">
          <div id="tableDiv">
            <table>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Message</th>
              </tr>
              {feedbacksAttributes.map((fbAttr) => {
                return (
                  <tr>
                    <td>{fbAttr.ID}</td>
                    <td>{fbAttr.Name}</td>
                    <td>{fbAttr.Email}</td>
                    <td>{fbAttr.Type}</td>
                    <td>{fbAttr.Message}</td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
