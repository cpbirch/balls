(ns balls.views.index
  (:require [balls.views.layout :refer [view-layout]]
            [balls.config :refer [config]])
  (:use [hiccup.core]))

(def title "Balls!!")

(defn- cctray-input-field []
  [:div
   [:input {:type "text" :placeholder "cc-tray url" :id "ci-url-text" :value ""}]
   [:input {:type "button" :id "ci-url-fetch-btn" :value "fetch"}]])


(defn- cctray-read-only-field [cctray-url]
  [:label {:id "ci-url-label" :value cctray-url} cctray-url])

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

(defn- preferences-section []
  [:div {:id "preferences"}
   [:input {:type "checkbox" :id "play-broken-build-sound" :checked "checked"}]
   [:label "play sound when balls break"]

   [:br]

   [:input {:type "checkbox" :id "play-sick-to-healthy-build-sound" :checked "checked"}]
   [:label "play sound when balls are healthy after they break."]

   [:br]

   [:input {:type "checkbox" :id "rotate-non-green-text" :checked "checked"}]
   [:label "rotate non-green balls names"]

   [:br]

   [:label "repulsion"]
   [:input {:type "range" :id "repulsion-factor" :min "1" :max "10" :value "1" :step "1"}]

   [:br]

   [:label "attraction"]
   [:input {:type "range" :id "attraction-factor" :min "1" :max "100" :value "1" :step "1"}]])

(defn contents []
  (let [c (config)]

    (view-layout title
                 [:div {:id "interface"}
                  [:button {:id "config"} "config"]]

                 (config-section c)

                 [:div {:id "preferences-control"}
                  [:button {:id "preferences-control-btn"} "controls"]]

                 [:div {:id "container"}]

                 (preferences-section)

                 [:script {:data-main "/scripts/app" :src "/scripts/lib/require.js"}])))


