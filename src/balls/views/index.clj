(ns balls.views.index
  (:require [balls.views.layout :refer [view-layout]])
  (:use [hiccup.core]))

(def title "Balls!!")

(defn contents []
  (view-layout title
               [:div {:id "interface"}
                [:button {:id "controls"} "Controls"]]

               [:div {:id "control-interface"}
                [:input {:type "text" :placeholder "cc-tray url" :id "ci-url-text" :value ""}]
                [:input {:type "button" :id "ci-url-fetch-btn" :value "fetch"}]

                [:input {:type "text" :id "filter-field" :placeholder "filter projects. can use regex" :value ""}]

                [:div {:id "selected-pipelines"}]

                [:div {:id "preferences"}
                 [:p {:class "title"} "preferences"]

                 [:input {:type "checkbox" :id "rotate-non-green-text" :checked "checked"}]
                 [:label "rotate non-green pipeline names"]

								 [:br]

								 [:label "repulsion"]
								 [:input {:type "range" :id "repulsion-factor" :min "1" :max "10" :value "1" :step "1"}]

								 [:br]

								 [:label "attraction"]
								 [:input {:type "range" :id "attraction-factor" :min "1" :max "100" :value "1" :step "1"}]

                 ]

                [:input {:type "button" :id "settings-save-btn" :value "save"}]
                [:input {:type "button" :id "settings-close-btn" :value "close"}]]


               [:div {:id "container"}]

               [:script {:data-main "/scripts/app" :src "/scripts/lib/require.js"}]))


