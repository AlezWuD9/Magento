require.config({"config": {
        "jsbuild":{"Vertex_Tax/js/form/element/custom-option-flex-field-select.js":"/*\n * @copyright  Vertex. All rights reserved.  https://www.vertexinc.com/\n * @author     Mediotype                     https://www.mediotype.com/\n */\n\ndefine(['underscore', 'Magento_Ui/js/form/element/select'], function (_, Select) {\n    'use strict';\n\n    return Select.extend({\n        /**\n         * Overwrites the parent's filter to allow for checking if a value is\n         * in an array and for allowing the value of \"unmapped\" through all\n         * filters\n         *\n         * @param {String} value\n         * @param {String} field\n         */\n        filter: function (value, field) {\n            var source = this.initialOptions,\n                result;\n\n            field = field || this.filterBy.field;\n\n            result = _.filter(source, function (item) {\n                return Array.isArray(item[field]) && item[field].includes(value) ||\n                    item[field] === value ||\n                    item.value === '' ||\n                    item.value === 'unmapped';\n            });\n\n            this.setOptions(result);\n        }\n    });\n});\n","Vertex_Tax/js/model/customer-country-validation.js":"/**\n * @copyright  Vertex. All rights reserved.  https://www.vertexinc.com/\n * @author     Mediotype                     https://www.mediotype.com/\n */\n\ndefine([\n    'jquery',\n    'Vertex_Tax/js/form/depend-field-checker',\n    'jquery/validate',\n    'mage/translate'\n], function ($, dependFieldChecker) {\n    'use strict';\n\n    /**\n     * Validates if customer added a VAT number, then selecting a Country is required.\n     */\n    return function (config) {\n        $.validator.addMethod(\n            \"vertex-customer-country\",\n            function (value, element, dependField) {\n                return dependFieldChecker.validateValues(dependField, value);\n            },\n            $.mage.__(\"Please select a Country.\")\n        );\n    }\n});\n","Vertex_Tax/js/model/set-checkout-messages.js":"/**\n * @copyright  Vertex. All rights reserved.  https://www.vertexinc.com/\n * @author     Mediotype                     https://www.mediotype.com/\n */\n\ndefine(\n    [\n        'underscore',\n        'Magento_Customer/js/customer-data',\n        'Magento_Ui/js/model/messageList'\n    ],\n    function (_, customerData, messageContainer) {\n        'use strict';\n\n        /**\n         * A utility for observing message updates in session storage. It is designed to subscribe to\n         * customer data updates and forward messages to the appropriate messageList model.\n         */\n        return function () {\n            var typeMap = {\n                    'success': 'addSuccessMessage',\n                    'warning': 'addErrorMessage',\n                    'error': 'addErrorMessage'\n                },\n\n                /**\n                 * Observe message section data changes and forward to the error processor.\n                 * @param {Object} data - The observable payload.\n                 * @return void\n                 */\n                messageSubscriptionCallback = function (data) {\n                    if ('messages' in data) {\n                        _.each(data.messages, function (message) {\n                            if (message.type in typeMap) {\n                                messageContainer[typeMap[message.type]]({\n                                    'message': message.text\n                                });\n                            }\n                        });\n                    }\n                };\n\n            customerData.get('messages').subscribe(messageSubscriptionCallback);\n        };\n    }\n);\n","Vertex_Tax/js/view/checkout/summary/tax-messages.js":"/**\n * @copyright  Vertex. All rights reserved.  https://www.vertexinc.com/\n * @author     Mediotype                     https://www.mediotype.com/\n */\n\ndefine([\n    'underscore',\n    'ko',\n    'uiComponent',\n    'Magento_Checkout/js/model/totals'\n], function (_, ko, Component, totals) {\n    'use strict';\n\n    return Component.extend({\n        defaults: {\n            messages: []\n        },\n\n        /** @inheritdoc */\n        initialize: function () {\n            this._super();\n            this.subscribeTotals();\n        },\n\n        /** @inheritdoc */\n        initObservable: function () {\n            this._super().observe('messages');\n            this.getMessages();\n\n            return this;\n        },\n\n        /**\n         * Retrieve messages\n         */\n        getMessages: function () {\n            var taxSegment = totals.getSegment('tax');\n\n            this.messages([]);\n\n            if (taxSegment && taxSegment['extension_attributes']) {\n                this.messages(taxSegment['extension_attributes']['vertex_tax_calculation_messages']);\n            }\n        },\n\n        /**\n         * Subscribe totals observer\n         */\n        subscribeTotals: function () {\n            var self = this;\n\n            totals.totals.subscribe(\n                function () {\n                    self.getMessages();\n                },\n                null,\n                'change'\n            );\n        }\n    });\n});\n"}
}});
