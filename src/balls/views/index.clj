(ns balls.views.index
  (:require [balls.views.layout :refer [view-layout]]
            [balls.config :refer [config-from-file default-breaking-build-sound default-success-from-broken-build-sound]]
            [balls.sounds :as sounds]
            [balls.data.events :as events])
  (:use [hiccup.core]))

(def title "Balls!!")

(defn- cctray-input-field []
  [:div
   [:input {:type "text" :placeholder "cc-tray url" :id "ci-url-text" :value ""}]
   [:input {:type "button" :id "ci-url-fetch-btn" :value "fetch"}]])


(defn- cctray-read-only-field [cctray-url]
  [:div
   [:input {:type "text" :placeholder "cc-tray url" :id "ci-url-text" :value cctray-url :disabled "disabled"}]])

(defn- cctray-field [cctray-url]
  (if (empty? cctray-url)
    (cctray-input-field)
    (cctray-read-only-field cctray-url)))

(defn- config-section [{:keys [cctray-url include exclude]}]
  [:div {:id "config-interface"}

   (cctray-field cctray-url)

   [:input {:type "text" :id "filter-field" :placeholder "select projects regex." :value include}]
   [:input {:type "text" :id "exclude-field" :placeholder "exclude projects." :value exclude}]

   [:div {:id "selected-pipelines"}]

   [:input {:type "button" :id "settings-reset-btn" :value "reset"}]
   [:input {:type "button" :id "settings-save-btn" :value "save"}]
   [:input {:type "button" :id "settings-close-btn" :value "close"}]])

(defn- option-for-sound [default-sound-name [name sound-path]]
  (let [option-attrs {:value sound-path}]
    (if (= name default-sound-name)
      [:option (assoc option-attrs :selected "selected") name]
      [:option option-attrs name])))

(defn- sound-select-list [elm-id all-sounds default-sound-name]
  [:select {:id elm-id}
   [:option {:value "none"} "do not play"]
   (map (partial option-for-sound default-sound-name) all-sounds)])

(defn- options-for-count [selected-build-count current-build-count]
  (if (= selected-build-count current-build-count)
    [:option (assoc {:value current-build-count} :selected "selected") current-build-count]
    [:option {:value current-build-count} current-build-count]))

(defn- build-count-list [elm-id number-of-builds selected-build-count]
  [:select {:id elm-id}
   [:option {:value "0"} "disable"]
   (map (partial options-for-count selected-build-count) (range 1 (inc number-of-builds)))])

(defn- preferences-section [{:keys [red-alert-threshold glitch-effect-threshold]}]
  (let [all-sounds (sounds/all)]

  [:div {:id "preferences"}

   [:label "balls breaking sound"]
   (sound-select-list "broken-build-sound-list", all-sounds, default-breaking-build-sound)

   [:br]

   [:label "breaking to healthy balls sound"]
   (sound-select-list "sick-to-healthy-build-sound-list", all-sounds, default-success-from-broken-build-sound)

   [:br]

   [:input {:type "checkbox" :id "rotate-non-green-text" :checked "checked"}]
   [:label "rotate non-green balls names"]

   [:br]

   [:label "repulsion"]
   [:input {:type "range" :id "repulsion-factor" :min "1" :max "10" :value "1" :step "1"}]

   [:br]

   [:label "attraction"]
   [:input {:type "range" :id "attraction-factor" :min "1" :max "100" :value "1" :step "1"}]

   [:br]

   [:label "red alert threshold"]
   (if-not red-alert-threshold
     (build-count-list "red-alert-threshold" 20 events/default-red-alert-threshold)
     [:label {:id "red-alert-threshold-disabled"} " can only be updated in config file."])

   [:br]

   [:label "glitch effect threshold"]
   (if-not glitch-effect-threshold
     (build-count-list "glitch-effect-threshold" 20 events/default-glitch-effect-threshold)
     [:label {:id "glitch-effect-threshold-disabled"} " can only be updated in config file."])

   [:br]

   ]))

(defn contents []
  (let [c (config-from-file)]

    (view-layout title
                 [:div {:id "interface"}
                  [:button {:id "config"} "config"]]

                 (config-section c)

                 [:div {:id "preferences-control"}
                  [:button {:id "preferences-control-btn"} "controls"]]

                 [:div {:id "container"}]

                 (preferences-section c)

                 [:div {:id "overlay"}]

                 [:script {:data-main "/scripts/app" :src "/scripts/lib/require.js"}])))


