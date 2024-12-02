import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import ConfigTable from './ConfigTable';
import { content } from './Content.js';

// Device Configuration 内容组件
const DeviceConfigContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    <li>{content[language].mustStartWith}</li>
    <li>{content[language].deviceModels}</li>
  </ul>
);

const DeviceNamingContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    <li>
      {content[language].allowedChars}
      <ul>
        <li>{content[language].letters}</li>
        <li>{content[language].numbers}</li>
        <li>{content[language].underscore}</li>
      </ul>
    </li>
    <li>{content[language].noSpaces}</li>
    <li>{content[language].uniqueName}</li>
  </ul>
);

// Group Configuration 内容组件
const GroupConfigContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    <li>{content[language].groupMustStartWith}</li>
    <li>
      {content[language].groupNamesCanContain}
      <ul>
        <li>{content[language].groupLetters}</li>
        <li>{content[language].groupNumbers}</li>
        <li>{content[language].groupUnderscore}</li>
        <li>{content[language].groupSpaces}</li>
      </ul>
    </li>
    <li>{content[language].uniqueGroupName}</li>
    <li>{content[language].listDevices}</li>
  </ul>
);

const GroupRulesContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    <li>
      {content[language].eachDeviceMust}
      <ul>
        <li>{content[language].previouslyDefined}</li>
        <li>{content[language].noSpacesInDevice}</li>
        <li>{content[language].uniqueInGroup}</li>
      </ul>
    </li>
    <li>{content[language].devicesSeparated}</li>
  </ul>
);

// Scene Configuration 内容组件
const SceneConfigContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    <li>{content[language].sceneConfig.mustStartWith}</li>
    <li>
      {content[language].sceneConfig.sceneNamesCanContain}
      <ul>
        <li>{content[language].sceneConfig.letters}</li>
        <li>{content[language].sceneConfig.numbers}</li>
        <li>{content[language].sceneConfig.underscore}</li>
        <li>{content[language].sceneConfig.spaces}</li>
      </ul>
    </li>
    <li>{content[language].sceneConfig.uniqueSceneName}</li>
  </ul>
);

const SceneRulesContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    {Object.entries(content[language].sceneConfig.deviceTypes).map(([key, type]) => (
      <li key={key}>
        {type.title}
        <ul>
          {type.rules instanceof Array ? (
            type.rules.map((rule, index) => <li key={index}>{rule}</li>)
          ) : (
            Object.entries(type.rules).map(([subKey, subType]) => (
              <li key={subKey}>
                {subType.title}
                <ul>
                  {subType.rules.map((rule, index) => <li key={index}>{rule}</li>)}
                </ul>
              </li>
            ))
          )}
        </ul>
      </li>
    ))}
    {content[language].sceneConfig.generalRules.map((rule, index) => (
      <li key={`general-${index}`}>{rule}</li>
    ))}
  </ul>
);

// Remote Control Configuration 内容组件
const RemoteControlDeclarationContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    <li>
      {content[language].remoteControlConfig.deviceNamesCanContain.title}
      <ul>
        {content[language].remoteControlConfig.deviceNamesCanContain.rules.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>
    </li>
    <li>
      {content[language].remoteControlConfig.deviceTypes.title}
      <ul>
        {content[language].remoteControlConfig.deviceTypes.types.map((type, index) => (
          <li key={index}>{type}</li>
        ))}
      </ul>
    </li>
  </ul>
);

const RemoteControlRulesContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    <li>
      {content[language].remoteControlConfig.commandFormat.title}
      <ul>
        <li>{content[language].remoteControlConfig.commandFormat.format}</li>
        <li>{content[language].remoteControlConfig.commandFormat.example}</li>
        {content[language].remoteControlConfig.commandFormat.notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </li>
    <li>
      {content[language].remoteControlConfig.commandTypes.title}
      <ul>
        <li>
          {content[language].remoteControlConfig.commandTypes.device.title}
          <ul>
            <li>
              {content[language].remoteControlConfig.commandTypes.device.basic.title}
              <ul>
                <li>{content[language].remoteControlConfig.commandTypes.device.basic.format}</li>
              </ul>
            </li>
            <li>
              {content[language].remoteControlConfig.commandTypes.device.deviceOperation.title}
              <ul>
                <li>
                  {content[language].remoteControlConfig.commandTypes.device.deviceOperation.curtain.title}
                  <ul>
                    {content[language].remoteControlConfig.commandTypes.device.deviceOperation.curtain.formats.map((format, index) => (
                      <li key={index}>{format}</li>
                    ))}
                  </ul>
                </li>
                <li>
                  {content[language].remoteControlConfig.commandTypes.device.deviceOperation.fan.title}
                  <ul>
                    {content[language].remoteControlConfig.commandTypes.device.deviceOperation.fan.formats.map((format, index) => (
                      <li key={index}>{format}</li>
                    ))}
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          {content[language].remoteControlConfig.commandTypes.group.title}
          <ul>
            <li>{content[language].remoteControlConfig.commandTypes.group.format}</li>
          </ul>
        </li>
        <li>
          {content[language].remoteControlConfig.commandTypes.scene.title}
          <ul>
            <li>{content[language].remoteControlConfig.commandTypes.scene.format}</li>
          </ul>
        </li>
      </ul>
    </li>
    {content[language].remoteControlConfig.rules.map((rule, index) => (
      <li key={`rule-${index}`}>{rule}</li>
    ))}
  </ul>
);

// Output Module Configuration 内容组件
const OutputModuleDeclarationContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    <li>{content[language].outputModuleConfig.mustStartWith}</li>
    <li>
      {content[language].outputModuleConfig.deviceNamesCanContain}
      <ul>
        <li>{content[language].outputModuleConfig.letters}</li>
        <li>{content[language].outputModuleConfig.numbers}</li>
        <li>{content[language].outputModuleConfig.underscore}</li>
        <li>{content[language].outputModuleConfig.spaces}</li>
      </ul>
    </li>
    <li>
      {content[language].outputModuleConfig.deviceTypes.title}
      <ul>
        {content[language].outputModuleConfig.deviceTypes.types.map((type, index) => (
          <li key={index}>{type}</li>
        ))}
      </ul>
    </li>
  </ul>
);

const OutputModuleRulesContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    <li>
      {content[language].outputModuleConfig.channelFormat.title}
      <ul>
        <li>{content[language].outputModuleConfig.channelFormat.basic}</li>
        <li>{content[language].outputModuleConfig.channelFormat.withAction}</li>
        {content[language].outputModuleConfig.channelFormat.notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </li>
    <li>
      {content[language].outputModuleConfig.actions.title}
      <ul>
        {content[language].outputModuleConfig.actions.types.map((action, index) => (
          <li key={index}>{action}</li>
        ))}
      </ul>
    </li>
    {content[language].outputModuleConfig.rules.map((rule, index) => (
      <li key={`rule-${index}`}>{rule}</li>
    ))}
  </ul>
);

// Remote Parameters Configuration 内容组件
const RemoteParametersDeclarationContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    <li>{content[language].remoteParametersConfig.globalNote}</li>
    <li>{content[language].remoteParametersConfig.optionalNote}</li>
    <li>
      {content[language].remoteParametersConfig.defaultValues}
      <ul>
        {Object.entries(content[language].remoteParametersConfig.parameters).map(([key, param]) => (
          <li key={key}>
            {param.title}: {param.defaultValue}
          </li>
        ))}
      </ul>
    </li>
  </ul>
);

const RemoteParametersRulesContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    {Object.entries(content[language].remoteParametersConfig.parameters).map(([key, param]) => (
      <li key={key}>
        {param.title}
        <ul>
          {param.values.map((value, index) => (
            <li key={index}>{value}</li>
          ))}
        </ul>
      </li>
    ))}
    {content[language].remoteParametersConfig.rules.map((rule, index) => (
      <li key={`rule-${index}`}>{rule}</li>
    ))}
  </ul>
);

// Input Module Configuration 内容组件
const InputModuleDeclarationContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    <li>{content[language].inputModuleConfig.mustStartWith}</li>
    <li>
      {content[language].inputModuleConfig.deviceNamesCanContain}
      <ul>
        <li>{content[language].inputModuleConfig.letters}</li>
        <li>{content[language].inputModuleConfig.numbers}</li>
        <li>{content[language].inputModuleConfig.underscore}</li>
        <li>{content[language].inputModuleConfig.spaces}</li>
      </ul>
    </li>
    <li>
      {content[language].inputModuleConfig.deviceTypes.title}
      <ul>
        {content[language].inputModuleConfig.deviceTypes.types.map((type, index) => (
          <li key={index}>{type}</li>
        ))}
      </ul>
    </li>
  </ul>
);

const InputModuleRulesContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    <li>
      {content[language].inputModuleConfig.channelFormat.title}
      <ul>
        <li>{content[language].inputModuleConfig.channelFormat.format}</li>
        {content[language].inputModuleConfig.channelFormat.notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </li>
    <li>
      {content[language].inputModuleConfig.actions.title}
      <ul>
        {content[language].inputModuleConfig.actions.types.map((action, index) => (
          <li key={index}>{action}</li>
        ))}
      </ul>
    </li>
    {content[language].inputModuleConfig.rules.map((rule, index) => (
      <li key={`rule-${index}`}>{rule}</li>
    ))}
  </ul>
);

// Dry Contact Module Configuration 内容组件
const DryContactDeclarationContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    <li>{content[language].dryContactConfig.mustStartWith}</li>
    <li>
      {content[language].dryContactConfig.deviceNamesCanContain}
      <ul>
        <li>{content[language].dryContactConfig.letters}</li>
        <li>{content[language].dryContactConfig.numbers}</li>
        <li>{content[language].dryContactConfig.underscore}</li>
        <li>{content[language].dryContactConfig.spaces}</li>
      </ul>
    </li>
    <li>
      {content[language].dryContactConfig.deviceTypes.title}
      <ul>
        {content[language].dryContactConfig.deviceTypes.types.map((type, index) => (
          <li key={index}>{type}</li>
        ))}
      </ul>
    </li>
  </ul>
);

const DryContactRulesContent = ({ language }) => (
  <ul style={{ margin: 0, paddingLeft: '20px' }}>
    <li>
      {content[language].dryContactConfig.actionFormat.title}
      <ul>
        <li>{content[language].dryContactConfig.actionFormat.format}</li>
        <li>{content[language].dryContactConfig.actionFormat.note}</li>
      </ul>
    </li>
    <li>
      {content[language].dryContactConfig.actions.title}
      <ul>
        {content[language].dryContactConfig.actions.types.map((action, index) => (
          <li key={index}>{action}</li>
        ))}
      </ul>
    </li>
    {content[language].dryContactConfig.rules.map((rule, index) => (
      <li key={`rule-${index}`}>{rule}</li>
    ))}
  </ul>
);

const ConfigurationGuidelines = ({ open, onClose }) => {
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (event, newLanguage) => {
    if (newLanguage !== null) {
      setLanguage(newLanguage);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          minWidth: '1000px',
          width: '80%',
          maxWidth: '1400px'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          m: 0, 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {content[language].title}
          <ToggleButtonGroup
            value={language}
            exclusive
            onChange={handleLanguageChange}
            size="small"
            sx={{ ml: 2 }}
          >
            <ToggleButton value="en" aria-label="english">EN</ToggleButton>
            <ToggleButton value="zh" aria-label="chinese">中文</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <h3>{content[language].deviceConfig}</h3>
        <ConfigTable
          keyword="DEVICE"
          leftColumn={{
            title: content[language].modelDeclaration,
            content: <DeviceConfigContent language={language} />
          }}
          rightColumn={{
            title: content[language].namingRules,
            content: <DeviceNamingContent language={language} />
          }}
          sx={{ mb: 4 }}
        />

        <h3>{content[language].outputModuleConfig.title}</h3>
        <ConfigTable
          keyword="OUTPUT MODULE"
          leftColumn={{
            title: content[language].outputModuleConfig.declaration,
            content: <OutputModuleDeclarationContent language={language} />
          }}
          rightColumn={{
            title: content[language].outputModuleConfig.configRules,
            content: <OutputModuleRulesContent language={language} />
          }}
        />

        <h3>{content[language].inputModuleConfig.title}</h3>
        <ConfigTable
          keyword="INPUT MODULE"
          leftColumn={{
            title: content[language].inputModuleConfig.declaration,
            content: <InputModuleDeclarationContent language={language} />
          }}
          rightColumn={{
            title: content[language].inputModuleConfig.configRules,
            content: <InputModuleRulesContent language={language} />
          }}
        />

        <h3>{content[language].dryContactConfig.title}</h3>
        <ConfigTable
          keyword="DRY CONTACT MODULE"
          leftColumn={{
            title: content[language].dryContactConfig.declaration,
            content: <DryContactDeclarationContent language={language} />
          }}
          rightColumn={{
            title: content[language].dryContactConfig.configRules,
            content: <DryContactRulesContent language={language} />
          }}
        />

        <h3>{content[language].groupConfig}</h3>
        <ConfigTable
          keyword="GROUP"
          leftColumn={{
            title: content[language].groupModelDeclaration,
            content: <GroupConfigContent language={language} />
          }}
          rightColumn={{
            title: content[language].deviceListRules,
            content: <GroupRulesContent language={language} />
          }}
          sx={{ mb: 4 }}
        />

        <h3>{content[language].sceneConfig.title}</h3>
        <ConfigTable
          keyword="SCENE"
          leftColumn={{
            title: content[language].sceneConfig.sceneDeclaration,
            content: <SceneConfigContent language={language} />
          }}
          rightColumn={{
            title: content[language].sceneConfig.deviceOperationRules,
            content: <SceneRulesContent language={language} />
          }}
        />

        <h3>{content[language].remoteControlConfig.title}</h3>
        <ConfigTable
          keyword="REMOTE CONTROL LINK"
          leftColumn={{
            title: content[language].remoteControlConfig.declaration,
            content: <RemoteControlDeclarationContent language={language} />
          }}
          rightColumn={{
            title: content[language].remoteControlConfig.configRules,
            content: <RemoteControlRulesContent language={language} />
          }}
        />

        <h3>{content[language].remoteParametersConfig.title}</h3>
        <ConfigTable
          keyword="REMOTE PARAMETERS"
          leftColumn={{
            title: content[language].remoteParametersConfig.declaration,
            content: <RemoteParametersDeclarationContent language={language} />
          }}
          rightColumn={{
            title: content[language].remoteParametersConfig.configRules,
            content: <RemoteParametersRulesContent language={language} />
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: '#fbcd0b',
            '&:hover': {
              color: '#e3b900'  // 稍微深一点的黄色作为悬停效果
            }
          }}
        >
          {content[language].closeButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigurationGuidelines;